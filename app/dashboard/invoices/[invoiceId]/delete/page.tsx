import SubmitButton from "@/app/components/SubmitButtons";
import prisma from "@/app/utils/db"
import RequireUser from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import WarningGif from '@/public/warning-gif.gif'
import { DeleteInvoice } from "@/app/actions";

async function Authorize(invoiceId: string, userId: string){
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId
        }
    });

    if(!data){
        return redirect('/dashboard/invoices')
    }
}


export default async function DeleteInvoiceRoute({params} : {params: {invoiceId: string}}){
    const session = await RequireUser();
    const {invoiceId} = await params
    await Authorize(invoiceId, session.user?.id as string)
    return(
        <div className="flex flex-1 justify-center items-center">
            <Card className="max-w-[500px]">
                <CardHeader>
                    <CardTitle>Delete Invoice</CardTitle>
                    <CardDescription>Are you sure you want to delete this invoice ?</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src={WarningGif} alt="warning" width={400} height={400} className="rounded-md"/>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <Link href="/dashboard/invoices" className={buttonVariants()}>
                    Cancel
                    </Link>

                    <form action={async() => {
                        'use server';
                       await DeleteInvoice(invoiceId)
                    }}>
                        <SubmitButton placeholder="Delete Invocie"/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}