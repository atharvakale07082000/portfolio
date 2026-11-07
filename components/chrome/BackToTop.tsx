"use client";

import { useLenis } from "lenis/react";
import { FiArrowUp } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { glideTop } from "@/lib/menu";

export default function BackToTop() {
    const lenis = useLenis();
    return (
        <button
            type="button"
            onClick={() => {
                glideTop(lenis);
                document.getElementById("main")?.focus({ preventScroll: true });
            }}
            className="btn btn-ghost btn-sm"
        >
            <BtnLabel>Back to top</BtnLabel>
            <BtnIcon dir="up">
                <FiArrowUp size={14} />
            </BtnIcon>
        </button>
    );
}
