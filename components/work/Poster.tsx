import Image from "next/image";
import { tone, type Work } from "@/lib/content";

/* A project poster: the project's two system tints, its title and its
   headline number — with the real screenshot framed inside when one
   exists. Sized in cqw so every copy (lens included) scales identically. */
export default function Poster({ work, priority = false }: { work: Work; priority?: boolean }) {
    return (
        <div
            className="relative h-full w-full overflow-hidden text-white [container-type:inline-size]"
            style={{
                backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${tone(work.tone[0])}, transparent 60%), radial-gradient(110% 100% at 100% 100%, ${tone(work.tone[1])}, transparent 65%), linear-gradient(160deg, rgb(var(--ink-2-rgb)), rgb(var(--ink-0-rgb)))`,
            }}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgb(255_255_255/0.5)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.5)_1px,transparent_1px)] [background-size:6cqw_6cqw] [mask-image:radial-gradient(80%_70%_at_50%_40%,#000,transparent)]"
            />
            <div className="absolute left-[5cqw] right-[5cqw] top-[4.5cqw] flex items-start justify-between gap-[3cqw]">
                <div>
                    <p className="text-[1.9cqw] font-medium uppercase tracking-[0.2em] text-white/75">{work.kind}</p>
                    <p className="mt-[1cqw] text-[7.2cqw] font-semibold leading-[0.95] tracking-[-0.04em]">{work.title}</p>
                </div>
                <p className="text-right">
                    <span className="block text-[6cqw] font-semibold leading-none tracking-[-0.04em] tabular-nums">{work.metric.value}</span>
                    <span className="mt-[0.8cqw] block max-w-[24cqw] text-[1.8cqw] leading-tight text-white/75">{work.metric.label}</span>
                </p>
            </div>
            {work.image ? (
                <div className="absolute inset-x-[7cqw] bottom-0 top-[27cqw] overflow-hidden rounded-t-[2cqw] border border-b-0 border-white/20 shadow-[0_-2cqw_6cqw_-2cqw_rgb(0_0_0/0.5)]">
                    <Image
                        src={work.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 700px, 92vw"
                        priority={priority}
                        className="object-cover object-top"
                    />
                </div>
            ) : (
                <div className="absolute inset-x-[5cqw] bottom-[4.5cqw] flex flex-wrap gap-[1.2cqw]">
                    {work.tech.map((t) => (
                        <span key={t} className="rounded-full border border-white/25 bg-white/10 px-[1.8cqw] py-[0.7cqw] text-[1.8cqw]">
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
