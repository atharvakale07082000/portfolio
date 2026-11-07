"use client";

import { useState } from "react";
import { FiArrowUpRight, FiCheck, FiLoader } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { contactTopics, profile } from "@/lib/content";

/* A native form: it POSTs straight to the form service without JS. With
   JS it submits in place and shows "Sending…" then a result. Without a
   configured endpoint it opens a pre-filled email instead. */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error";

function Field({
    id,
    label,
    type = "text",
    multiline = false,
    autoComplete,
}: {
    id: string;
    label: string;
    type?: string;
    multiline?: boolean;
    autoComplete?: string;
}) {
    const cls =
        "peer block w-full rounded-2xl border border-[var(--line-strong)] bg-raised px-4 pb-2.5 pt-6 text-body text-fg placeholder-transparent transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";
    return (
        <div className="relative">
            {multiline ? (
                <textarea id={id} name={id} required rows={5} placeholder={label} className={`${cls} min-h-[160px] resize-y`} />
            ) : (
                <input id={id} name={id} type={type} required placeholder={label} autoComplete={autoComplete} className={cls} />
            )}
            <label
                htmlFor={id}
                className="pointer-events-none absolute left-4 top-2 text-caption text-muted transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-body peer-focus:top-2 peer-focus:text-caption peer-focus:text-link"
            >
                {label}
            </label>
        </div>
    );
}

export default function ContactForm() {
    const [status, setStatus] = useState<Status>("idle");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        if (!ENDPOINT) {
            const subject = `Portfolio enquiry${data.get("topic") ? ` — ${data.get("topic")}` : ""}`;
            const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
            window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error(String(res.status));
            form.reset();
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    }

    const sending = status === "sending";

    return (
        <form action={ENDPOINT || `mailto:${profile.email}`} method="POST" onSubmit={onSubmit} className="space-y-5" aria-describedby="form-status">
            <fieldset>
                <legend className="label text-muted">What is it about? (optional)</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                    {contactTopics.map((t) => (
                        <label key={t} className="cursor-pointer">
                            <input type="radio" name="topic" value={t} className="peer sr-only" />
                            <span className="chip text-small text-fg transition-colors peer-checked:border-transparent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgb(var(--link-rgb))] hover:border-[var(--line-strong)]">
                                {t}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>
            <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" autoComplete="name" />
                <Field id="email" label="Email address" type="email" autoComplete="email" />
            </div>
            <Field id="message" label="Tell me about the project" multiline />
            {/* Honeypot for bots; humans never see it. */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="flex flex-wrap items-center gap-4 pt-2">
                <button type="submit" disabled={sending} aria-disabled={sending} className="btn btn-accent btn-lg">
                    {sending ? (
                        <>
                            <FiLoader size={17} className="motion-safe:animate-spin" aria-hidden="true" />
                            Sending…
                        </>
                    ) : (
                        <>
                            <BtnLabel>Send message</BtnLabel>
                            <BtnIcon>
                                <FiArrowUpRight size={18} />
                            </BtnIcon>
                        </>
                    )}
                </button>
                <p id="form-status" role="status" className="text-small text-muted">
                    {status === "sent" && (
                        <span className="inline-flex items-center gap-2 text-fg">
                            <FiCheck className="text-sys-green" aria-hidden="true" /> Thanks — your message is on its way.
                        </span>
                    )}
                    {status === "error" && <>That didn&apos;t send. Try again, or email {profile.email}.</>}
                    {status === "idle" && !ENDPOINT && <>Opens your email app with the message filled in.</>}
                </p>
            </div>
        </form>
    );
}
