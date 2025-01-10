import { InvoiceList } from "@/app/components/InvoiceList";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function InvoicesRoutes(){
    return(
        <Card className="bg-matt2 border-zinc-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-neutral-300">Invoices</CardTitle>
                        <CardDescription className="text-gray1">Manage your invoices right here</CardDescription>
                    </div>
                    <Link href="/dashboard/invoices/create" className={buttonVariants({
                        variant: 'secondary'
                    })}>
                    <PlusIcon/> Create Invoice
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={
                    <Skeleton className="w-full h-[500px]">

                    </Skeleton>}>
                <InvoiceList/>
                </Suspense>
            </CardContent>
        </Card>
    )
}