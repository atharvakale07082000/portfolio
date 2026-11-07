"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { BtnIcon } from "./Btn";
import { profile } from "@/lib/content";

/** Copies the email address; falls back to opening the mail client. */
export default function CopyEmail({ className = "", label }: { className?: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 2200);
        } catch {
            window.location.href = `mailto:${profile.email}`;
        }
    }

    return (
        <button type="button" onClick={copy} className={`btn btn-ghost ${className}`}>
            <BtnIcon dir="down">{copied ? <FiCheck size={16} /> : <FiCopy size={16} />}</BtnIcon>
            <span className="btn-label-swap">
                <span>{copied ? "Copied to clipboard" : (label ?? profile.email)}</span>
                <span aria-hidden="true">{copied ? "Copied to clipboard" : "Copy email"}</span>
            </span>
            <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
            </span>
        </button>
    );
}
