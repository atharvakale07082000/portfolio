"use client";

import { motion } from "framer-motion";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export default function ExperiencePage() {
    return (
        <div className="bg-canvas min-h-screen">
            <div className="max-w-3xl mx-auto px-5 md:px-8 pt-36 pb-32 md:pt-44">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16"
                >
                    <p className="eyebrow text-[15px] mb-4">Experience</p>
                    <h1 className="display text-[44px] md:text-[64px] text-ink">
                        The journey so far.
                    </h1>
                </motion.div>

                <ExperienceTimeline />
            </div>
        </div>
    );
}
