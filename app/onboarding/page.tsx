"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "../components/SubmitButtons";
import { useActionState, useState } from "react";
import { onboardUser } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../utils/zodSchemas";
import Image from "next/image";

export default function OnBoarding() {
  const [lastResult, formAction] = useActionState(onboardUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [imgBase64, setImgBase64] = useState("");

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImgBase64(reader.result.toString());
        }
      };
      reader.readAsDataURL(file); // Convert file to Base64
      console.log("BASE64STRING:", imgBase64);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-matt3 ">
      <Card className="max-w-sm mx-auto bg-matt1 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-xl text-neutral-300">
            Your are almost finished !
          </CardTitle>
          <CardDescription className="text-gray1">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
            className="grid gap-4"
          >
              <div className="flex items-center justify-between gap-2 w-full mb-4">
                {imgBase64 && (
                  <Image
                    src={imgBase64}
                    alt="profile picture"
                    width={40}
                    height={40}
                    className="rounded-full size-10"
                  />
                )}
                <label htmlFor="profileImg" className="bg-matt1 border-[1px] px-2 py-1.5 border-zinc-700 rounded-md flex-1 text-sm text-gray1">
                    Select Profile Picture 
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="profileImg"
                  onChange={handleImgChange}
                  className="hidden"
                />
                <input
                  type="hidden"
                  name={fields.profileImg.name}
                  value={imgBase64}
                />
                <p className="text-xs text-zinc-500">
                  {fields.profileImg.errors}
                </p>
              </div>
            <div className="grid grid-cols-2 gap-4">

              <div className="flex flex-col gap-2">
                <Label className="form-label">FirstName</Label>
                <Input
                  name={fields.firstName.name}
                  key={fields.firstName.key}
                  defaultValue={fields.firstName.initialValue}
                  className="form-input"
                  placeholder="John"
                />
                <p className="text-xs text-zinc-500">
                  {fields.firstName.errors}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="form-label">LastName</Label>
                <Input
                  name={fields.lastName.name}
                  key={fields.lastName.key}
                  defaultValue={fields.lastName.initialValue}
                  className="form-input"
                  placeholder="Doe"
                />
                <p className="text-xs text-zinc-500">
                  {fields.lastName.errors}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="form-label">Address</Label>
              <Input
                name={fields.address.name}
                key={fields.address.key}
                defaultValue={fields.address.initialValue}
                className="form-input"
                placeholder="Wall Street, 123"
              />
              <p className="text-xs text-zinc-500">{fields.address.errors}</p>
            </div>

            <SubmitButton placeholder="Finish Onboarding" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
