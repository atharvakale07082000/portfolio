import { ImageResponse } from "next/og";
import { ACCENT_BRIGHT, MarkSvg } from "./brandMark";
import { profile } from "./content";

export const ogSize = { width: 1200, height: 630 };

export function renderOg() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 72,
                    background: "radial-gradient(70% 80% at 85% 10%, #0a3a7a 0%, #000 60%)",
                    color: "#F5F5F7",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <MarkSvg size={64} />
                    <div style={{ fontSize: 30, fontWeight: 600 }}>{profile.name}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: ACCENT_BRIGHT }}>
                        {profile.role}
                    </div>
                    <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
                        {profile.statement}
                    </div>
                </div>
                <div style={{ display: "flex", fontSize: 24, color: "#A1A1A6" }}>{`${profile.location} · Agents · Retrieval · Backend at load`}</div>
            </div>
        ),
        ogSize
    );
}
