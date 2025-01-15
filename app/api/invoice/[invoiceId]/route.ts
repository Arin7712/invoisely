import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import jsPDF from 'jspdf';
import { formatCurrency } from "@/app/utils/formatCurrency";

export async function GET(request: Request, { params }: { params: { invoiceId: string } }) {

  const { invoiceId } = await params;
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientAddress: true,
      clientEmail: true,
      date: true,
      dueDate: true,
      items: true,
      total: true,
      tax: true,
      note: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const items = data.items.map((item: { description: string; rate: number; quantity: number }) => ({
    description: item.description,
    rate: item.rate,
    quantity: item.quantity,
  }));

  const calculateItemTotal = (quantity: string, rate: string) => {
    return (Number(quantity) || 0) * (Number(rate) || 0);
  };

  let yPosition = 110;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  pdf.setFont('helvetica');
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  // From Section
  pdf.setFontSize(12);
  pdf.text("From", 20, 40);
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  // Client Section
  pdf.setFontSize(12);
  pdf.text("Bill To", 20, 70);
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  // Invoice Details
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
  pdf.text(`Date: ${new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long'
  }).format(data.date)}`, 120, 45);
  pdf.text(`Due Date: Net ${data.dueDate}`, 120, 50);

  // Item table header
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Sub total", 160, 100);

  // draw header line
  pdf.line(20, 102, 190, 102);

  // Item Details
  pdf.setFont("helvetica", "normal");

  // Loop through items and dynamically add rows
  items.forEach((item, index) => {
    if (yPosition > 270) { // Check if we need to add a new page for more items
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(item.description, 20, yPosition);
    pdf.text(item.quantity.toString(), 100, yPosition);
    pdf.text(
      formatCurrency({
        amount: item.rate,
        currency: data.currency as any,
      }),
      130,
      yPosition
    );
    pdf.text(
      formatCurrency({ amount: (item.rate * item.quantity), currency: data.currency as any }),
      160,
      yPosition
    );

    yPosition = yPosition + 10;
  });

  // Total Section
  pdf.line(20, yPosition + 5, 190, yPosition + 5);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Tax (${data.tax} %)`, 130, yPosition + 15);
  pdf.text(`Total (${data.currency})`, 130, yPosition + 20);
  pdf.text(data.total.toString(), 160, yPosition + 15);
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    yPosition + 20
  );

  // Additional Note
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note:", 20, yPosition + 35);
    pdf.text(data.note, 20, yPosition + 40);
  }

  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline'
    }
  });
}
