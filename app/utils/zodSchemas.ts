import {z} from 'zod';

export const onboardingSchema = z.object({
    firstName: z.string().min(2, "Firstname is required"),
    lastName: z.string().min(2, "Lastname is required"),
    address: z.string().min(2, 'Address is required'),
    profileImg: z
    .string()
    .refine((data) => /^data:image\/(png|jpeg|jpg);base64,/.test(data), {
      message: "Invalid image format. Only PNG, JPEG, or JPG are allowed.",
    })
    .refine((data) => {
      const base64String = data.split(",")[1]; // Extract the Base64 content
      const sizeInBytes = (base64String.length * 3) / 4; // Approximate size in bytes
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB limit
      return sizeInBytes <= maxSizeInBytes;
    }, {
      message: "Image size exceeds the maximum limit of 5MB.",
    }),
});

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, 'Invoice name is required'),
    total: z.number().min(1, '$1 is minimum'),
    tax: z.number().min(1, '1 is minimum'),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.number().min(0, "Due date is required"),
    fromName: z.string().min(1, "Your name is required"),
    fromEmail: z.string().email("Invalid email address"),
    fromAddress: z.string().min(1, "Your address is reuiqred"),
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid email address"),
    clientAddress: z.string().min(1, "Client address is reuqired"),
    currency: z.string().min(1, "Currency is required"),
    invoiceNumber: z.number().min(1, "Minimum invoice number of 1"),
    note: z.string().optional(),
    items: z.array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        rate: z.number().min(1, "Rate is required"),
        quantity: z.number().min(1, "Quantity is required")
      })
    ).min(1, "Atleast one item is required")
})

export const emailTemplateSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject cannot exceed 255 characters"),
  body: z
    .string()
    .min(1, "Email body is required")
    .max(10000, "Email body cannot exceed 10,000 characters"), // Adjust max length as per your requirements
  userId: z
    .string()
    .min(1, "User ID is required") // Validates that userId is a non-empty string
});
