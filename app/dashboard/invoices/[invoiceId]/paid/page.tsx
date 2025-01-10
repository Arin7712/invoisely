import { MarkAsPaidAction } from "@/app/actions";
import SubmitButton from "@/app/components/SubmitButtons";
import prisma from "@/app/utils/db";
import RequireUser from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PaidGif from '@/public/paid-gif.gif'
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Authorize(invoiceId: string, userId: string){
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId
        }
    });

    if(!data){
        return redirect("/dashboard/invoices")
    }
}

export default async function MarkAsPaid({params} : {params: {invoiceId: string}}){
    const {invoiceId } = await params;
    const session = await RequireUser()
    await Authorize(invoiceId, session.user?.id as string)

    return(
        <div className="flex flex-1 justify-center items-center">
            <Card className="max-w-[500px] bg-matt1 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-neutral-200">Mark as paid?</CardTitle>
                    <CardDescription className="text-gray1">Are you sure you want to mark this invoice as paid ?</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src={PaidGif} alt="paid" width={400} height={400} className="rounded-md"/>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <Link href="/dashboard/invoices" className={buttonVariants()}>Cancel</Link>
                    <form action={async() => {
                        "use server";
                        await MarkAsPaidAction(invoiceId)
                    }}>
                        <SubmitButton placeholder="Mark as paid !"/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}