"use client";

import { motion } from "framer-motion";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export default function ExperiencePage() {
    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">Professional Journey</h1>

                    <div className="bg-navy/30 rounded-3xl p-6 md:p-10 border border-white/5">
                        <ExperienceTimeline />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
