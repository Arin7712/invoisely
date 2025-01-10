import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from '../utils/auth';
import SubmitButton from '../components/SubmitButtons';
import { redirect } from 'next/navigation';

export default async function Login(){

    const session = await auth();
    if(session){
        redirect("/onboarding")
    }

    return(
        <>
        <div className="flex h-screen w-full items-center justify-center px-4 bg-matt3">
            <Card className="max-w-sm bg-matt1 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-2xl text-neutral-200">Login</CardTitle>
                    <CardDescription className="text-gray1">Enter your email below to login into your account</CardDescription>
                        </CardHeader>
                    <CardContent>
                        <form 
                        className="flex flex-col gap-y-4"
                        action={async(formData) => {
                            "use server"
                            await signIn("nodemailer", formData)
                        }}
                        >
                            <div className="flex flex-col gap-y-2">
                            <Label className="text-neutral-200">Email</Label>
                            <Input name="email" type="email" required className="bg-[#212126] border-zinc-700 text-gray1" placeholder="hello@hello.com"/>
                            </div>
                            <SubmitButton/>
                        </form>
                    </CardContent>
            </Card>
        </div>
        </>
    )
}