import { ogSize, renderOg } from "@/lib/ogImage";

export const alt = "Atharva Kale — AI & Backend Engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
    return renderOg();
}
