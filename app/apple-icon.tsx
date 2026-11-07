import { ImageResponse } from "next/og";
import { ACCENT } from "@/lib/brandMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* iOS rounds the corners itself, so the apple icon is a full-bleed square. */
export default function AppleIcon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: ACCENT }}>
                <svg width="120" height="120" viewBox="8 7 16 18">
                    <path
                        d="M10.6 22.5 15 9.5h2l4.4 13M12.3 17.8h7.4"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        ),
        size
    );
}
