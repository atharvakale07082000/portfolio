"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { ReactLenis } from "lenis/react";
import { LazyMotion } from "framer-motion";


const loadFeatures = () => import("@/lib/motionFeatures").then((mod) => mod.default);

/** Site-wide smooth scrolling (native scroll under reduced motion), and the
 *  lazily loaded animation features every `m.*` component draws on. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const reduce = useReducedMotion();
    return (
        <ReactLenis
            root
            options={{
                lerp: reduce ? 1 : 0.11,
                smoothWheel: !reduce,
                wheelMultiplier: 1,
                touchMultiplier: 1.4,
            }}
        >
            <LazyMotion features={loadFeatures} strict>
                {children}
            </LazyMotion>
        </ReactLenis>
    );
}
