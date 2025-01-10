import { buttonVariants } from "@/components/ui/button";
import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";

interface RequireProps{
    title: string,
    description: string
}

export function EmptyState({title, description} : RequireProps){
    return(
        <div className="group flex flex-col flex-1 h-full items-center justify-center p-8 rounded-md border-[1px] border-dashed border-zinc-700 bg-matt2 animate-in fade-in-50">
            <div className="flex items-center justify-center size-20 rounded-full border-zinc-700 border-[2px] group-hover:border-zinc-500 transition-all duration-500">
                <Ban className="size-10 text-zinc-700 group-hover:text-zinc-500 duration-500 transition-all"/>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-neutral-200">{title}</h2>
            <p className="mb-6 mt-2 text-sm max-w-xm mx-auto text-center text-gray1">{description}</p>
            <Link href="/dashboard/invoices/create" className={buttonVariants({
                variant: 'secondary'
            })}>
            <PlusCircle className="size-4 mr-2"/> Create Invoice
            </Link>
        </div>
    )
}