"use server";

import RequireUser from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { sub } from "date-fns";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await RequireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
      image: submission.value.profileImg,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await RequireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Prepare the items for nested create
  const items = submission.value.items.map(
    (item: { description: string; rate: number; quantity: number }) => ({
      description: item.description,
      rate: item.rate,
      quantity: item.quantity,
    })
  );

  const data = await prisma.invoice.create({
    data: {
      userId: session.user?.id,
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      items: {
        create: items, // Use 'create' for nested item creation
      },
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      tax: submission.value.tax,
      note: submission.value.note,
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Arin ",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "aringawande7712@gmail.com" }],
    template_uuid: "ebc31b38-9f46-41b5-aed4-409aa4aa31d2",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function updateInvoice(prevState: any, formData: FormData) {
  const session = await RequireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const items = submission.value.items.map(
    (item: { description: string; rate: number; quantity: number }) => ({
      description: item.description,
      rate: item.rate,
      quantity: item.quantity,
    })
  );

  const currentInvoice = await prisma.invoice.findUnique({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    select: {
      items: true,
    },
  });

  // Add new items to the current list of items
  const allItems = [...(currentInvoice?.items ?? []), ...items];

  // Update the invoice with the newly added items
  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      items: {
        deleteMany: {},
        create: items, // Only create new items
      },
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      tax: submission.value.tax,
      note: submission.value.note,
    },
  });

  // Send the email after updating the invoice
  const sender = {
    email: "hello@demomailtrap.com",
    name: "Arin",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "aringawande7712@gmail.com" }],
    template_uuid: "b36fd3ef-7d55-4d4c-9ec9-144313fd2536",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
    },
  });

  // Redirect after invoice update
  return redirect("/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await RequireUser();

  // Delete the invoiceItems in the invoice first
  await prisma.invoiceItem.deleteMany({
    where: { invoiceId },
  });

  const data = await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
  const session = await RequireUser();
  const data = await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/dashboard/invoices");
}

export async function UpdateUser(prevState: any, formData: FormData) {
  const session = await RequireUser();
  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
      image: submission.value.profileImg,
    },
  });

  return redirect("/dashboard");
}
