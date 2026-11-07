/**
 * Hand-written 2D physics for the skills pile. Circles only.
 *  - semi-implicit Euler with substeps
 *  - circle–circle contacts: positional correction + restitution impulse,
 *    plus a capped friction impulse that trades linear and angular motion
 *  - floor and walls with restitution, friction and rolling
 *  - linear, angular and contact damping, plus per-body sleeping (a body
 *    that stays near-still dozes off; impacts and interaction wake it and
 *    its neighbours), so nothing spins or jitters forever and the loop stops
 * All mutation lives in these module functions, never in React handlers.
 */

export type Body = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    m: number;
    a: number; // angle, radians
    av: number; // angular velocity, rad/s
    held: boolean;
    still: number; // seconds spent near-still
    asleep: boolean;
};

export type World = {
    w: number;
    h: number;
    bodies: Body[];
    restFor: number; // seconds every body has been near-still
};

const GRAVITY = 2400; // px/s²
const SUBSTEPS = 4;
const RESTITUTION = 0.32;
const WALL_RESTITUTION = 0.38;
const FRICTION = 0.24; // contact friction coefficient
const FLOOR_FRICTION = 3.2; // 1/s — how fast sliding stops on the floor
const LINEAR_DAMPING = 0.12; // 1/s
const ANGULAR_DAMPING = 1.6; // 1/s — mid-air spin dies out
const MAX_SPEED = 3200;
const SLEEP_MOTION = 28; // px/s of linear or rim speed below which a body may doze
const SLEEP_AFTER = 0.35; // s
const WAKE_SPEED = 90; // px/s relative impact that wakes a sleeper
const CONTACT_SPIN_KEEP = 0.985; // per substep while touching — rolling on a pile fades

export const SIZE_PATTERN = [1.28, 1, 0.88, 1.12, 0.94, 1.2, 0.84, 1.06, 1, 0.9, 1.16, 0.96];

/** One radius per item — always exactly as long as the data. */
export function radiiFor(count: number, stageWidth: number): number[] {
    const base = Math.max(20, Math.min(40, stageWidth / 26));
    return Array.from({ length: count }, (_, i) => base * SIZE_PATTERN[i % SIZE_PATTERN.length]);
}

export function createWorld(w: number, h: number, radii: number[]): World {
    const bodies = radii.map((r, i) => ({
        x: r + ((i * 0.618034 * (w - 2 * r)) % Math.max(1, w - 2 * r)),
        y: -r - i * r * 0.9 - 40,
        vx: (((i * 37) % 11) - 5) * 18,
        vy: 0,
        r,
        m: r * r,
        a: 0,
        av: 0,
        held: false,
        still: 0,
        asleep: false,
    }));
    return { w, h, bodies, restFor: 0 };
}

/** Lay bodies out as a settled pile without simulating (reduced motion). */
export function settle(world: World): void {
    let x = 0;
    let y = world.h;
    let rowH = 0;
    for (const b of world.bodies) {
        if (x + 2 * b.r > world.w) {
            x = 0;
            y -= rowH;
            rowH = 0;
        }
        b.x = x + b.r;
        b.y = y - b.r;
        b.vx = b.vy = b.av = 0;
        b.asleep = true;
        x += 2 * b.r + 2;
        rowH = Math.max(rowH, 2 * b.r + 2);
    }
}

export function resize(world: World, w: number, h: number, radii: number[]): void {
    world.w = w;
    world.h = h;
    world.bodies.forEach((b, i) => {
        b.r = radii[i] ?? b.r;
        b.m = b.r * b.r;
        b.x = Math.min(Math.max(b.x, b.r), w - b.r);
        b.y = Math.min(b.y, h - b.r);
        wake(b);
    });
    world.restFor = 0;
}

function wake(b: Body) {
    b.asleep = false;
    b.still = 0;
}

/** Wake a body and everything touching it, so nothing is left floating. */
function wakeAround(world: World, b: Body) {
    const queue = [b];
    while (queue.length) {
        const cur = queue.pop()!;
        if (!cur.asleep && cur !== b) continue;
        wake(cur);
        for (const o of world.bodies) {
            if (o.asleep && Math.hypot(o.x - cur.x, o.y - cur.y) < o.r + cur.r + 2) queue.push(o);
        }
    }
}

function clampSpeed(b: Body) {
    const s = Math.hypot(b.vx, b.vy);
    if (s > MAX_SPEED) {
        b.vx *= MAX_SPEED / s;
        b.vy *= MAX_SPEED / s;
    }
}

function collide(world: World, a: Body, b: Body) {
    if (a.asleep && b.asleep) return;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const min = a.r + b.r;
    const d2 = dx * dx + dy * dy;
    if (d2 >= min * min || d2 === 0) return;
    const d = Math.sqrt(d2);
    const nx = dx / d;
    const ny = dy / d;
    // A hard hit wakes a sleeper; a gentle touch treats it as fixed ground.
    if (a.asleep || b.asleep) {
        const vn0 = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (-vn0 > WAKE_SPEED) wakeAround(world, a.asleep ? a : b);
    }
    const ia = a.held || a.asleep ? 0 : 1 / a.m;
    const ib = b.held || b.asleep ? 0 : 1 / b.m;
    const sum = ia + ib;
    if (sum === 0) return;

    // Push apart, shared by inverse mass (a held body does not move).
    const overlap = (min - d) * 0.9;
    a.x -= nx * overlap * (ia / sum);
    a.y -= ny * overlap * (ia / sum);
    b.x += nx * overlap * (ib / sum);
    b.y += ny * overlap * (ib / sum);

    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;
    const vn = rvx * nx + rvy * ny;
    if (vn > 0) return;
    const j = (-(1 + RESTITUTION) * vn) / sum;
    a.vx -= j * ia * nx;
    a.vy -= j * ia * ny;
    b.vx += j * ib * nx;
    b.vy += j * ib * ny;

    // Touching bodies lose spin quickly; rolling over a pile fades out.
    a.av *= CONTACT_SPIN_KEEP;
    b.av *= CONTACT_SPIN_KEEP;

    // Friction along the tangent, including surface speed from spin.
    const tx = -ny;
    const ty = nx;
    const vt = rvx * tx + rvy * ty - (a.av * a.r + b.av * b.r);
    const jt = Math.max(-FRICTION * j, Math.min(FRICTION * j, -vt / (sum * 3)));
    a.vx -= jt * ia * tx;
    a.vy -= jt * ia * ty;
    b.vx += jt * ib * tx;
    b.vy += jt * ib * ty;
    // Solid disc: I = m r² / 2, so Δω = 2·jt / (m r).
    if (ia > 0) a.av -= (2 * jt * ia) / a.r;
    if (ib > 0) b.av -= (2 * jt * ib) / b.r;
}

function walls(b: Body, w: number, h: number, dt: number) {
    if (b.y + b.r > h) {
        b.y = h - b.r;
        if (b.vy > 0) b.vy = b.vy < 60 ? 0 : -b.vy * WALL_RESTITUTION;
        // Sliding friction, and rolling: spin is pulled toward vx / r.
        b.vx *= Math.max(0, 1 - FLOOR_FRICTION * dt);
        if (Math.abs(b.vx) < 12) b.vx = 0;
        b.av += (b.vx / b.r - b.av) * Math.min(1, 12 * dt);
    }
    if (b.x - b.r < 0) {
        b.x = b.r;
        if (b.vx < 0) b.vx = -b.vx * WALL_RESTITUTION;
    } else if (b.x + b.r > w) {
        b.x = w - b.r;
        if (b.vx > 0) b.vx = -b.vx * WALL_RESTITUTION;
    }
    if (b.y < -h * 1.5) {
        b.y = -h * 1.5;
        if (b.vy < 0) b.vy = 0;
    }
}

/** Advance the world. Returns true while anything is still awake. */
export function step(world: World, dt: number): boolean {
    const h = dt / SUBSTEPS;
    const { bodies, w, h: H } = world;
    for (let s = 0; s < SUBSTEPS; s++) {
        for (const b of bodies) {
            if (b.held || b.asleep) continue;
            b.vy += GRAVITY * h;
            clampSpeed(b);
            b.x += b.vx * h;
            b.y += b.vy * h;
            b.a += b.av * h;
        }
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) collide(world, bodies[i], bodies[j]);
        }
        for (const b of bodies) if (!b.held && !b.asleep) walls(b, w, H, h);
    }

    let awake = false;
    const lin = Math.max(0, 1 - LINEAR_DAMPING * dt);
    const ang = Math.max(0, 1 - ANGULAR_DAMPING * dt);
    for (const b of bodies) {
        if (b.held) {
            awake = true;
            continue;
        }
        if (b.asleep) continue;
        b.vx *= lin;
        b.vy *= lin;
        b.av *= ang;
        const motion = Math.max(Math.hypot(b.vx, b.vy), Math.abs(b.av) * b.r);
        // Near-still dozes fast; a slow wedge-jitter (against a wall, say) dozes too, just later.
        b.still = motion < SLEEP_MOTION ? b.still + dt : motion < SLEEP_MOTION * 2.6 ? b.still + dt * 0.35 : 0;
        if (b.still >= SLEEP_AFTER) {
            b.asleep = true;
            b.vx = b.vy = b.av = 0;
        } else {
            awake = true;
        }
    }
    world.restFor = awake ? 0 : world.restFor + dt;
    return awake;
}

export function render(world: World, els: (HTMLElement | null)[]): void {
    world.bodies.forEach((b, i) => {
        const el = els[i];
        if (!el) return;
        el.style.width = `${b.r * 2}px`;
        el.style.height = `${b.r * 2}px`;
        el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0) rotate(${b.a}rad)`;
    });
}

export function shake(world: World): void {
    for (const b of world.bodies) {
        wake(b);
        b.held = false;
        b.vy = -(1300 + Math.random() * 1100);
        b.vx += (Math.random() - 0.5) * 900;
        b.av += (Math.random() - 0.5) * 12;
    }
    world.restFor = 0;
}

export function grab(world: World, i: number): void {
    const b = world.bodies[i];
    if (!b) return;
    wakeAround(world, b);
    b.held = true;
    b.vx = b.vy = 0;
    world.restFor = 0;
}

export function drag(world: World, i: number, x: number, y: number, dt: number): void {
    const b = world.bodies[i];
    if (!b) return;
    const nx = Math.min(Math.max(x, b.r), world.w - b.r);
    const ny = Math.min(y, world.h - b.r);
    if (dt > 0) {
        // Smoothed release velocity, so a flick throws and a stop drops.
        b.vx = b.vx * 0.5 + ((nx - b.x) / dt) * 0.5;
        b.vy = b.vy * 0.5 + ((ny - b.y) / dt) * 0.5;
    }
    b.x = nx;
    b.y = ny;
    world.restFor = 0;
}

export function release(world: World, i: number): void {
    const b = world.bodies[i];
    if (!b) return;
    b.held = false;
    wakeAround(world, b);
    clampSpeed(b);
    world.restFor = 0;
}
