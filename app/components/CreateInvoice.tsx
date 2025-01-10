"use client";

import { createInvoice } from "@/app/actions";
import SubmitButton from "@/app/components/SubmitButtons";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { invoiceSchema } from "@/app/utils/zodSchemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CalendarIcon } from "lucide-react";
import { useActionState, useState } from "react";

interface iAppProps {
  firstName: string,
  lastName: string,
  address: string,
  email: string
}

export function CreateInvoice({firstName, lastName, address, email}: iAppProps){
  const [tax, setTax] = useState("");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currency, setCurrency] = useState("USD")
  // const calculateTotal = (Number(rate) || 0) * (Number(quantity) || 0);
  const [lastResult, action] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([
    { description: "", quantity: "", rate: "" },
  ]);
  
  // Add item
  const addItem = () => {
    setItems([...items, { description: "", quantity: "", rate: "" }]);
  };
  
  // Remove item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateItemTotal = (quantity: string, rate: string) => {
    return (Number(quantity) || 0) * (Number(rate) || 0);
  };

  
  const subtotal = items.reduce((acc, item) => {
    return acc + calculateItemTotal(item.quantity, item.rate);
  }, 0);

  const taxAmount = (subtotal * Number(tax) / 100);

  const totalAfterTax = subtotal + taxAmount;

  return (
    <Card className="w-full max-w-6xl mx-auto bg-matt2 border-zinc-700">
      <CardContent className="p-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>


          <input type='hidden' name={fields.date.name} value={selectedDate.toISOString()}/>
          <input type='hidden' name={fields.total.name} value={totalAfterTax}/>

          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-matt1 border-zinc-700 text-gray1">Draft</Badge>
              <Input name={fields.invoiceName.name} key={fields.invoiceName.key} defaultValue={fields.invoiceName.initialValue} className="form-input" placeholder="test" />
            </div>
            <p className="input-error">{fields.invoiceName.errors}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label className="form-label">Invoice no.</Label>
              <div className="flex">
                <span className="px-3 border-r-0 rounded-l-md bg-matt1 border-zinc-700 text-gray1 border-[1px] flex items-center">
                  #
                </span>
                <Input name={fields.invoiceNumber.name} key={fields.invoiceNumber.key} defaultValue={fields.invoiceNumber.initialValue} className="rounded-l-none" placeholder="5" />
              </div>
              <p className="input-error">{fields.invoiceNumber.errors}</p>
            </div>

            <div>
              <Label className="form-label">Currency</Label>
              <Select onValueChange={(e) => setCurrency(e)} defaultValue="USD" name={fields.currency.name} key={fields.currency.key}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="bg-matt1 border-zinc-700 text-gray1">
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="input-error">{fields.currency.errors}</p>
            </div>
          <div>
            <Label className="form-label">Tax*</Label>
            <Input type="number" name={fields.tax.name} key={fields.tax.key} value={tax} onChange={(e) => setTax(e.target.value)}/>
            <p className="input-error">{fields.tax.errors}</p>
          </div>
          </div>


          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="form-label">From</Label>
              <div className="space-y-2">
                <Input name={fields.fromName.name} key={fields.fromName.key} defaultValue={firstName + " " + lastName} placeholder="Your Name" />
                <p className="input-error">{fields.fromName.errors}</p>
                <Input name={fields.fromEmail.name} key={fields.fromEmail.key} defaultValue={email} placeholder="Your Email" />
                <p className="input-error">{fields.fromEmail.errors}</p>
                <Input name={fields.fromAddress.name} key={fields.fromAddress.key} defaultValue={address} placeholder="Your Address" />
                <p className="input-error">{fields.fromAddress.errors}</p>
              </div>
            </div>

            <div>
              <Label className="form-label">Client</Label>
              <div className="space-y-2">
              <Input name={fields.clientName.name} key={fields.clientName.key} defaultValue={fields.clientName.initialValue} placeholder="Client Name" />
                <p className="input-error">{fields.clientName.errors}</p>
                <Input name={fields.clientEmail.name} key={fields.clientEmail.key} defaultValue={fields.clientEmail.initialValue} placeholder="Client Email" />
                <p className="input-error">{fields.clientEmail.errors}</p>
                <Input name={fields.clientAddress.name} key={fields.clientAddress.key} defaultValue={fields.clientAddress.initialValue} placeholder="Client Address" />
                <p className="input-error">{fields.clientAddress.errors}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="">
              <div>
                <Label className="form-label">Date</Label>
              </div>
              <Popover>
                <PopoverTrigger  asChild>
                  <Button
                    
                    className="w-[280px] text-left justify-start bg-matt1 border-[1px] text-gray1 border-zinc-700"
                  >
                    <CalendarIcon />{" "}
                    {selectedDate ? (
                      new Intl.DateTimeFormat("en-Us", {
                        dateStyle: "long",
                      }).format(selectedDate)
                    ) : (
                      <span>Pick a Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date || new Date());
                    }}
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="input-error">{fields.date.errors}</p>
            </div>

            <div>
              <Label className="form-label">Invoice Due</Label>
              <Select name={fields.dueDate.name} key={fields.dueDate.key} defaultValue={fields.dueDate.initialValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Due Date" />
                </SelectTrigger>
                <SelectContent className="bg-matt1 border-zinc-700 text-gray1">
                  <SelectItem value="0">Due on Reciept</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="input-error">{fields.dueDate.errors}</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium form-label">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
          </div>

          <div >
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  className="border-zinc-700 bg-matt1 text-gray1 resize-none"
                  value={item.description}
                  name={`items[${index}].description`}
                  onChange={(e) => {
                    const updatedItems = [...items];
                    updatedItems[index].description = e.target.value;
                    setItems(updatedItems);
                  }}
                  placeholder="Item name & description"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  name={`items[${index}].quantity`}
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...items];
                    updatedItems[index].quantity = e.target.value;
                    setItems(updatedItems);
                  }}
                  placeholder="0"
                />
              </div>
              <div className="cols-span-2">
                <Input
                  type="number"
                  value={item.rate}
                  name={`items[${index}].rate`}
                  onChange={(e) => {
                    const updatedItems = [...items];
                    updatedItems[index].rate = e.target.value;
                    setItems(updatedItems);
                  }}
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={formatCurrency({
                    amount: Number(item.rate) * Number(item.quantity),
                    currency: currency as any,
                  })}
                  disabled
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-12 flex justify-end mt-2">
                <Button variant="outline" onClick={() => removeItem(index)}>
                  Remove Item
                </Button>
              </div>
              <div className="flex justify-end mb-6">
            <Button onClick={addItem}>Add Item</Button>
          </div>
            </div>
          ))}

            {/*<div className="col-span-6">
              <Textarea className="border-zinc-700 bg-matt1 text-gray1 resize-none" name={fields.} key={fields.invoiceItemDescription.key} defaultValue={fields.invoiceItemDescription.initialValue} placeholder="Item name & description" />
              <p className="input-error">{fields.invoiceItemDescription.errors}</p>
            </div>
            <div className="col-span-2">
              <Input name={fields.invoiceItemQuantity.name} value={quantity} key={fields.invoiceItemQuantity.key} onChange={(e) => setQuantity(e.target.value)} type="number" placeholder="0" />
            </div>
            <div className="col-span-2">
              <Input name={fields.invoiceItemRate.name} key={fields.invoiceItemRate.key} value={rate} onChange={(e) => setRate(e.target.value)} type="number" placeholder="0" />
              <p className="input-error">{fields.invoiceItemRate.errors}</p>
            </div>
            <div className="col-span-2">
              <Input value={formatCurrency({amount : calculateTotal, currency:currency as any})} disabled />
            </div>*/}
          </div>

          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span className="form-label">Subtotal</span>
                <span className="text-neutral-50 font-bold">{subtotal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="form-label">Tax</span>
                <span className="text-neutral-50 font-bold">{tax}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-zinc-700">
                <span className="form-label">Total ({currency})</span>
                <span className="font-medium underline underline-offset-2 text-neutral-50">
                {formatCurrency({ amount: totalAfterTax, currency: currency as any })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="form-label">Note</Label>
            <Textarea className="resize-none border-zinc-700 bg-matt1 text-gray1" name={fields.note.name} key={fields.note.key} defaultValue={fields.note.initialValue} placeholder="Add your note/s right here..." />
            <p className="input-errors">{fields.note.errors}</p>
          </div>

          <div className="flex items-center justify-end mt-6">
            <SubmitButton placeholder="Send Invoice to Client" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}