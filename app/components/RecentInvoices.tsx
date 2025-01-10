import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "../utils/db";
import RequireUser from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

async function getData(userId: string){
    const data = await prisma.invoice.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            clientName: true,
            clientEmail: true,
            total: true,
            currency: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 7
    })

    return data;
}

export async function RecentInvoices(){
    const session = await RequireUser()
    const data = await getData(session.user?.id as string)
    return(
        <Card className="bg-matt1 border-zinc-700">
            <CardHeader>
                <CardTitle className="text-neutral-200">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                {data.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                    <Avatar className=" flex size-9">
                        <AvatarFallback>{item.clientName.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none text-neutral-400">{item.clientName}</p>
                        <p className="text-sm text-muted-foreground text-gray1">{item.clientEmail}</p>
                    </div>

                    <div className="font-medium text-neutral-50">
                        +{formatCurrency({amount: item.total, currency: item.currency as any})}
                    </div>
                </div>
                ))}
            </CardContent>
        </Card>
    )
}