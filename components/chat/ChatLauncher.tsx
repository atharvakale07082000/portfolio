"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX } from "react-icons/fi";
import { BtnIcon } from "@/components/system/Btn";

/* Only the floating button ships with the page. The panel — and the
   streaming client — download on first intent. */
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

export default function ChatLauncher() {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setOpen(false);
            buttonRef.current?.focus();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                onPointerEnter={() => void loadPanel()}
                onFocus={() => void loadPanel()}
                aria-expanded={open}
                aria-controls="chat-panel"
                aria-label={open ? "Close the question panel" : "Ask AI about Atharva's work"}
                className="btn glass fixed bottom-4 right-[var(--gutter)] z-[90] h-12 gap-2 px-4 text-fg sm:bottom-6"
            >
                <BtnIcon dir="down">{open ? <FiX size={17} /> : <FiMessageCircle size={17} />}</BtnIcon>
                <span className="text-small font-medium">{open ? "Close" : "Ask AI"}</span>
            </button>
            <AnimatePresence>
                {open && (
                    <ChatPanel
                        key="chat"
                        onClose={() => {
                            setOpen(false);
                            buttonRef.current?.focus();
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
