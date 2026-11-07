import { ImageResponse } from "next/og";
import { MarkSvg } from "@/lib/brandMark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", background: "transparent" }}>
                <MarkSvg size={64} />
            </div>
        ),
        size
    );
}
