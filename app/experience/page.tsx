"use client";

import { motion } from "framer-motion";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export default function ExperiencePage() {
    return (
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-32 pb-28 md:pt-44 md:pb-36">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12 md:mb-16"
            >
                <p className="telemetry text-signal mb-6">Experience</p>
                <h1 className="display display-tight t-h1 text-ink">
                    Three roles,
                    <br />
                    one throughline.
                </h1>
                <p className="t-lead text-graphite max-w-xl mt-6">
                    Making slow systems fast, then making generative systems reliable enough
                    to put in front of people.
                </p>
            </motion.div>

            <ExperienceTimeline />
        </div>
    );
}
