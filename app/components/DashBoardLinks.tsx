"use client"

import { cn } from "@/lib/utils";
import { HomeIcon, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const dashboardLinks = [
    {
        id: 0,
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon
    },
    {
        id: 1,
        name: 'Invoices',
        href: '/dashboard/invoices',
        icon: Users2
    }
]

export default function DashBoardLinks(){

    const pathname = usePathname();

    return(
        <>
            {dashboardLinks.map((link) => (
                <Link href={link.href} key={link.id} className={cn(
                    pathname === link.href ? 'text-neutral-300 bg-matt2' : 'text-gray1 hover:bg-matt2', 'flex items-center gap-3 rounded-lg px-3 py-2 mb-1 transition-all hover:text-neutral-300'
                )}>
                    <link.icon className="size-4"/>
                    {link.name}
                </Link>
            ))}
        </>
    )
}