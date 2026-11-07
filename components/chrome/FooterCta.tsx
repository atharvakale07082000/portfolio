"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import CopyEmail from "@/components/system/CopyEmail";

/** The closing call to action. Hidden on /contact, where it would repeat the page. */
export default function FooterCta() {
    const pathname = usePathname();
    if (pathname === "/contact") return null;
    return (
        <div className="border-b hairline pb-16 pt-6 md:pb-24">
            <p className="label text-muted">What&apos;s next</p>
            <h2 className="mt-5 max-w-[16ch] text-h1 font-semibold text-fg">
                Have a system that needs to <span className="accent-word">think</span>? Let&apos;s build it.
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/contact" className="btn btn-accent btn-lg">
                    <BtnLabel>Let&apos;s talk</BtnLabel>
                    <BtnIcon>
                        <FiArrowUpRight size={18} />
                    </BtnIcon>
                </Link>
                <CopyEmail className="btn-lg" />
            </div>
        </div>
    );
}
