import Link from "next/link";
import FooterCta from "./FooterCta";
import BackToTop from "./BackToTop";
import Spotlight from "./Spotlight";
import Roll from "@/components/system/Roll";
import LocalTime from "@/components/system/LocalTime";
import YearNow from "@/components/system/YearNow";
import { pages } from "@/lib/menu";
import { profile, socials } from "@/lib/content";

export default function Footer() {
    return (
        <footer className="surface-dark relative z-10 -mt-8 overflow-hidden rounded-t-[2rem]">
            <div className="shell pt-16 md:pt-24">
                <FooterCta />

                <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr]">
                    <div>
                        <p className="label text-muted">Elsewhere</p>
                        <ul className="mt-4 space-y-2">
                            {socials.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                        {...(s.label === "Résumé" ? { download: true } : {})}
                                        className="roll-host text-lead font-medium text-fg"
                                    >
                                        <Roll text={s.label} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="label text-muted">Pages</p>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/" className="roll-host text-lead font-medium text-fg">
                                    <Roll text="Home" />
                                </Link>
                            </li>
                            {pages.map((p) => (
                                <li key={p.href}>
                                    <Link href={p.href} className="roll-host text-lead font-medium text-fg">
                                        <Roll text={p.label} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1 lg:items-end lg:text-right">
                        <p className="label text-muted">Local time</p>
                        <p className="text-lead font-medium text-fg">
                            <LocalTime />
                        </p>
                        <BackToTop />
                    </div>
                </div>
            </div>

            <div className="px-[var(--gutter)]">
                <Spotlight text={profile.name} />
            </div>

            <div className="shell flex flex-col gap-2 pb-24 pt-8 text-caption text-muted sm:flex-row sm:items-center sm:justify-between sm:pb-8 sm:pr-40">
                <p>
                    © <YearNow /> {profile.name}. Designed and built in {profile.city}.
                </p>
                <p>Next.js · Tailwind · Framer Motion</p>
            </div>
        </footer>
    );
}
