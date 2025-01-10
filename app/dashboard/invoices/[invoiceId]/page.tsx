import { EditInvoice } from "@/app/components/EditInvoice";
import prisma from "@/app/utils/db"
import RequireUser from "@/app/utils/hooks";
import { notFound } from "next/navigation";

async function getData(userId: string, invoiceId: string){
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId
        },
        include: {
            items: true
        }

    });
    if(!data){
        return notFound();
    }
    return data;
}

export default async function EditInvoiceRoute({params}: {params: {invoiceId: string}}){
    const {invoiceId} = await params;
    const session = await RequireUser();
    const data = await getData(session.user?.id as string, invoiceId);
    return(
        <EditInvoice data={data} items={data.items}/>
    )
}