import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceActions } from "./InvoiceActions";
import prisma from "../utils/db";
import RequireUser from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";

async function getData(userId: string){
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const data = await prisma.invoice.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            clientName: true,
            total: true,
            createdAt: true,
            status: true,
            invoiceNumber: true,
            currency: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return data;
}

export async function InvoiceList(){
    const session = await RequireUser();
    const data = await getData(session.user?.id as string)
    return(
        <>
        {data.length == 0 ? 
        <EmptyState title="No Invoice Found" description="Create an invoice to get started."/> :
        (

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-neutral-300">Invoice ID</TableHead>
                    <TableHead className="text-neutral-300">Customer</TableHead>
                    <TableHead className="text-neutral-300">Amount</TableHead>
                    <TableHead className="text-neutral-300">Status</TableHead>
                    <TableHead className="text-neutral-300">Date</TableHead>
                    <TableHead className="text-right text-neutral-300">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="text-gray-300">
                {data.map((invoice) => (
                <TableRow key={invoice.id}>
                    <TableCell>#{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{formatCurrency({amount: invoice.total, currency: invoice.currency as any})}</TableCell>
                    <TableCell>
                        <Badge className="bg-matt1 border-zinc-700 text-gray1">
                            {invoice.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                    }).format(invoice.createdAt)}</TableCell>
                    <TableCell className="text-right">
                        <InvoiceActions status={invoice.status} id={invoice.id}/>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        )}
        </>
    )
}