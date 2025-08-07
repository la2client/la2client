'use client';

import {usePathname} from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    if (pathname?.includes('/admin')) return null;
    return(
        <div>Navbar</div>
    )
}