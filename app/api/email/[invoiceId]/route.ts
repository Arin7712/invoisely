import prisma from "@/app/utils/db";
import RequireUser from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { invoiceId: string } }) {
try {
    const session = await RequireUser();

    const { invoiceId } = await params;
  
    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });
  
    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
  
    const sender = {
      email: "hello@demomailtrap.com",
      name: "Arin ",
    };
  
    emailClient.send({
      from: sender,
      to: [{ email: "aringawande7712@gmail.com" }],
      template_uuid: "26ad76a9-c802-4640-b3cd-9cc7629d8108",
    template_variables: {
      "first_name": invoiceData.clientName,
      "company_info_name": "Invoicfy",
      "company_info_address": "Wall Street",
      "company_info_city": "Munich",
      "company_info_zip_code": "20222",
      "company_info_country": "Germany"
    }
    });
    return NextResponse.json({ success: true });
} catch (error) {
    return NextResponse.json({error: 'Failed to send email reminder'}, {status: 500})
}
}
