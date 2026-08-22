"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

type Props = {
    children: ReactNode;
    className: string;
    eventFrom?: string;
};

export function HomeCreateCta({ children, className, eventFrom }: Props) {
    return (
        <Link
            href="/create"
            onClick={() => track("home_create_click", eventFrom ? { from: eventFrom } : undefined)}
            className={className}
        >
            {children}
        </Link>
    );
}
