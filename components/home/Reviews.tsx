import { testimonials } from "@/lib/content";

/* Every quote visible at once, as speech bubbles that fit one viewport —
   nothing hidden behind a carousel. Rendered only when quotes exist. */
export default function Reviews() {
    return (
        <section
            id="reviews"
            aria-labelledby="reviews-title"
            className="surface-white relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
        >
            <div className="shell">
                <p className="label text-muted">Reviews</p>
                <h2 id="reviews-title" className="mt-5 max-w-[16ch] text-h2 font-semibold text-fg">
                    In other people&apos;s <span className="accent-word">words</span>
                </h2>
                <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t) => (
                        <li key={t.name}>
                            <figure>
                                <blockquote className="relative rounded-3xl rounded-bl-md bg-raised p-6 text-body text-fg after:absolute after:-bottom-2 after:left-0 after:h-4 after:w-4 after:bg-raised after:[clip-path:polygon(0_0,100%_0,0_100%)]">
                                    “{t.quote}”
                                </blockquote>
                                <figcaption className="mt-4 pl-2 text-small">
                                    <span className="font-semibold text-fg">{t.name}</span>
                                    <span className="text-muted"> · {t.role}</span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
