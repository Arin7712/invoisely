'use client'

import { createInvoice, updateInvoice } from "@/app/actions";
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
import { Prisma } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

interface iAppProps {
    data: Prisma.InvoiceGetPayload<{}>,
    items: {

      description: string,
      rate: number,
      quantity:number,
      id: string; createdAt: Date; updatedAt: Date; 
    }[]
    
  }

export function EditInvoice({data, items} : iAppProps){
  console.log("INVOICE EDIT", items)
      // const [rate, setRate] = useState(data.i.toString());
      const [tax, setTax] = useState(data.tax.toString())
      // const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
      const [currency, setCurrency] = useState(data.currency)
      // const calculateTotal = (Number(rate) || 0) * (Number(quantity) || 0);
      const [lastResult, action] = useActionState(updateInvoice, undefined);
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
      const [selectedDate, setSelectedDate] = useState(data.date);
      const [newItems, setItems] = useState([
        { description: "", quantity: "", rate: "" },
      ]);

      useEffect(() => {
        if (items && Array.isArray(items)) {
          // If `items` exists and is an array, proceed with setting the state
          const populatedItems = items.map(item => ({
            description: item.description || "",
            quantity: item.quantity.toString() || "",
            rate: item.rate.toString() || "",
          }));
          setItems(populatedItems);
        } else {
          // If `items` doesn't exist or isn't an array, initialize it to an empty array
          setItems([{ description: "", quantity: "", rate: "" }]);
        }
      }, [items]);
      
      // Add item
      const addItem = () => {
        setItems([...newItems, { description: "", quantity: "", rate: "" }]);
      };
      
      // Remove item
      const removeItem = (index: number) => {
        setItems(newItems.filter((_, i) => i !== index));
      };
    
      const calculateItemTotal = (quantity: string, rate: string) => {
        return (Number(quantity) || 0) * (Number(rate) || 0);
      };
    
      
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAfterTax, setTotalAfterTax] = useState(0);

  useEffect(() => {
    const newSubtotal = newItems.reduce((acc, item) => {
      return acc + calculateItemTotal(item.quantity, item.rate);
    }, 0);

    const newTaxAmount = (newSubtotal * (Number(tax) || 0)) / 100;
    const newTotalAfterTax = newSubtotal + newTaxAmount;

    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotalAfterTax(newTotalAfterTax);
  }, [newItems, tax]); 
    return(
        <Card className="w-full max-w-6xl mx-auto bg-matt2 border-zinc-700">
      <CardContent className="p-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>


          <input type='hidden' name={fields.date.name} value={selectedDate.toISOString()}/>
          <input type='hidden' name={fields.total.name} value={totalAfterTax}/>
          <input type='hidden' name="id" value={data.id}/>

          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-matt1 border-zinc-700 text-gray1">Draft</Badge>
              <Input name={fields.invoiceName.name} key={fields.invoiceName.key} defaultValue={data.invoiceName} className="form-input" placeholder="test" />
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
                <Input name={fields.invoiceNumber.name} key={fields.invoiceNumber.key} defaultValue={data.invoiceNumber} className="rounded-l-none" placeholder="5" />
              </div>
              <p className="input-error">{fields.invoiceNumber.initialValue}</p>
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
                <Input name={fields.fromName.name} key={fields.fromName.key} defaultValue={data.fromName} placeholder="Your Name" />
                <p className="input-error">{fields.fromName.errors}</p>
                <Input name={fields.fromEmail.name} key={fields.fromEmail.key} defaultValue={data.fromEmail} placeholder="Your Email" />
                <p className="input-error">{fields.fromEmail.errors}</p>
                <Input name={fields.fromAddress.name} key={fields.fromAddress.key} defaultValue={data.fromAddress} placeholder="Your Address" />
                <p className="input-error">{fields.fromAddress.errors}</p>
              </div>
            </div>

            <div>
              <Label className="form-label">Client</Label>
              <div className="space-y-2">
              <Input name={fields.clientName.name} key={fields.clientName.key} defaultValue={data.clientName} placeholder="Client Name" />
                <p className="input-error">{fields.clientName.errors}</p>
                <Input name={fields.clientEmail.name} key={fields.clientEmail.key} defaultValue={data.clientEmail} placeholder="Client Email" />
                <p className="input-error">{fields.clientEmail.errors}</p>
                <Input name={fields.clientAddress.name} key={fields.clientAddress.key} defaultValue={data.clientAddress} placeholder="Client Address" />
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
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
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
              <Select name={fields.dueDate.name} key={fields.dueDate.key} defaultValue={data.dueDate.toString()}>
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
              <p className="col-span-5">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
          </div>

          <div>
            {newItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-5">
                  <Textarea
                    className="border-zinc-700 bg-matt1 text-gray1 resize-none"
                    value={item.description}
                    name={`items[${index}].description`}
                    onChange={(e) => {
                      const updatedItems = [...newItems];
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
                      const updatedItems = [...newItems];
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
                      const updatedItems = [...newItems];
                      updatedItems[index].rate = e.target.value;
                      setItems(updatedItems);
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={formatCurrency({
                      amount: calculateItemTotal(item.quantity, item.rate),
                      currency: currency as any,
                    })}
                    disabled
                  />
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex">
                  <Button variant="outline" onClick={() => removeItem(index)}>
                    Remove Item
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mb-6">
              <Button onClick={addItem}>Add Item</Button>
            </div>
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
              <div className="flex justify-between py-2 border-t">
                <span className="form-label">Total ({currency})</span>
                <span className="font-medium underline underline-offset-2 text-neutral-50">
                  {formatCurrency({amount:totalAfterTax, currency:currency as any})}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="form-label">Note</Label>
            <Textarea className="resize-none border-zinc-700 bg-matt1 text-gray1" name={fields.note.name} key={fields.note.key} defaultValue={data.note?? undefined} placeholder="Add your Note/s right here..."/>
            <p className="input-errors">{fields.note.errors}</p>
          </div>

          <div className="flex items-center justify-end mt-6">
            <SubmitButton placeholder="Update Invoice" />
          </div>
        </form>
      </CardContent>
    </Card>
    )
}