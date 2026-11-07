/* Shared pieces for the .btn system. Server-safe: no hooks. */

/** The label rolls up into an identical copy on hover. */
export function BtnLabel({ children }: { children: string }) {
    return (
        <span className="btn-label">
            <span>{children}</span>
            <span aria-hidden="true">{children}</span>
        </span>
    );
}

/** The icon leaves one way while its copy arrives from the other. */
export function BtnIcon({
    children,
    dir = "diagonal",
}: {
    children: React.ReactNode;
    dir?: "diagonal" | "down" | "right" | "up";
}) {
    return (
        <span className="btn-icon-swap" data-dir={dir} aria-hidden="true">
            <span>{children}</span>
            <span>{children}</span>
        </span>
    );
}
