"use client";

import { motion } from "framer-motion";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export default function ExperiencePage() {
    return (
        <div className="min-h-screen py-16 md:py-32 px-4 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
            >
                <div className="px-8 py-16 md:px-20 md:py-24">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-16 uppercase">
                        Journey.
                    </h1>

                    <div className="relative">
                        {/* The solid gray line running entirely down the left side */}
                        <div className="absolute left-[3px] md:left-[5px] top-2 bottom-4 w-[2px] bg-gray-100 hidden sm:block" />
                        <ExperienceTimeline />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
