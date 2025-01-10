import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, CreditCard, DollarSign, User } from "lucide-react";
import prisma from "../utils/db";
import RequireUser from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

async function getData(userId: string){
    const [data, openInvoices, paidInvoices] = await Promise.all([
        prisma.invoice.findMany({
            where: {
                userId: userId,
            },
            select: {
                total: true
            }
        }),
        prisma.invoice.findMany({
            where: {
                userId: userId,
                status: 'PENDING'
            }, 
            select: {
                id: true
            }
        }),
        prisma.invoice.findMany({
            where: {
                userId: userId,
                status: 'PAID'
            },
            select: {
                id: true
            }
        }),
    ])

    return {data, openInvoices, paidInvoices}
}

export async function DashBoardBlocks(){
    const session = await RequireUser();
    const {data, openInvoices, paidInvoices} = await getData(session.user?.id as string)
    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            <Card className="bg-matt1 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-gray1 font-medium">Total Revenue</CardTitle>
                    <DollarSign className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold text-neutral-300">
                        {formatCurrency({amount: data.reduce((acc, invoice) => acc + invoice.total, 0), currency: 'USD'})}
                    </h2>
                    <p className="text-xs text-gray1">Based on total volume.</p>
                </CardContent>
            </Card>
            <Card className="bg-matt1 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-gray1 font-medium">Total Invoices Issues</CardTitle>
                    <User className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold text-neutral-300">
                        +{data.length}
                    </h2>
                    <p className="text-xs text-gray1">Total Invoices Issues</p>
                </CardContent>
            </Card>
            <Card className="bg-matt1 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-gray1 font-medium">Paid Invoices</CardTitle>
                    <CreditCard className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold text-neutral-300">
                        +{paidInvoices.length}
                    </h2>
                    <p className="text-xs text-gray1">Total invoices which have been paid</p>
                </CardContent>
            </Card>
            <Card className="bg-matt1 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-gray1 font-medium">Pending Invoices</CardTitle>
                    <ActivityIcon className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold text-neutral-300">
                        +{openInvoices.length}
                    </h2>
                    <p className="text-xs text-gray1">Invoices which are currently pending !</p>
                </CardContent>
            </Card>
        </div>
    )
}