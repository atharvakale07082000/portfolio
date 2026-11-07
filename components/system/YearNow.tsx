"use client";

import { useYear } from "./clientValues";

export default function YearNow() {
    const year = useYear();
    return <>{year ?? ""}</>;
}
