"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";

/* Before and after. Requests (dots) cross one blocking worker, or four
   queue consumers. The figures are real results from two pieces of work. */

const LANES_BEFORE = 1;
const LANES_AFTER = 4;

export default function ThroughputDemo() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { margin: "100px" });
    const [after, setAfter] = useState(true);
    const lanes = after ? LANES_AFTER : LANES_BEFORE;
    const duration = after ? 1.1 : 3.2;

    return (
        <div ref={ref} className="flex h-full flex-col gap-[3cqw] p-[4cqw] text-[2.5cqw] text-white">
            <div className="inline-flex self-start rounded-full bg-black/30 p-[0.8cqw]" role="group" aria-label="Architecture">
                {[
                    { v: false, label: "Before" },
                    { v: true, label: "After" },
                ].map((o) => (
                    <button
                        key={o.label}
                        type="button"
                        aria-pressed={after === o.v}
                        onClick={() => setAfter(o.v)}
                        className={`rounded-full px-[3cqw] py-[1.2cqw] transition-colors ${
                            after === o.v ? "bg-white text-ink-2" : "text-white/75 hover:text-white"
                        }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-1 flex-col justify-center gap-[1.6cqw]" aria-hidden="true" data-paused={!inView}>
                {Array.from({ length: LANES_AFTER }, (_, lane) => (
                    <div
                        key={lane}
                        className={`relative h-[5cqw] overflow-hidden rounded-full border transition-opacity duration-500 ${
                            lane < lanes ? "border-white/30 bg-black/20 opacity-100" : "border-white/10 opacity-25"
                        }`}
                    >
                        {lane < lanes &&
                            [0, 1, 2].map((d) => (
                                <span
                                    key={`${after}-${d}`}
                                    className="lane-dot absolute inset-0"
                                    style={{
                                        animationDuration: `${duration}s`,
                                        animationDelay: `${(d * duration) / 3 + lane * 0.13}s`,
                                        animationPlayState: inView ? "running" : "paused",
                                    }}
                                >
                                    <span className="absolute left-0 top-1/2 -mt-[1.2cqw] h-[2.4cqw] w-[2.4cqw] rounded-full bg-white" />
                                </span>
                            ))}
                    </div>
                ))}
            </div>

            <dl className="grid grid-cols-2 gap-[2cqw]">
                <div className="rounded-[2cqw] bg-black/25 p-[2.6cqw]">
                    <dt className="text-white/70">API latency</dt>
                    <dd className="mt-[0.6cqw] text-[5.4cqw] font-semibold tabular-nums leading-none">{after ? "200ms" : "3s"}</dd>
                </div>
                <div className="rounded-[2cqw] bg-black/25 p-[2.6cqw]">
                    <dt className="text-white/70">Ingestion throughput</dt>
                    <dd className="mt-[0.6cqw] text-[5.4cqw] font-semibold tabular-nums leading-none">{after ? "10×" : "1×"}</dd>
                </div>
            </dl>
            <p className="text-[2.1cqw] text-white/70">
                Real results: 3s → 200ms from an API redesign; 10× from moving ingestion onto RabbitMQ queues.
            </p>
        </div>
    );
}
