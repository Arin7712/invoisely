import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function Verify(){
    return(
        <div className="flex h-screen w-full items-center justify-center">
            <Card className="w-[380px] px-5 bg-matt1">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex size-20 bg-zinc-800 items-center justify-center rounded-full">
                        <Mail className="size-12 text-gray-300"/>
                    </div>

                    <CardTitle className="text-2xl font-bold text-neutral-200">Check your email</CardTitle>
                    <CardDescription className="text-gray1">We've sent a verification link to your email address.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="rounded-md bg-neutral-50 px-2 py-1.5 border-zinc-600">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="size-5 text-matt1"/>
                            <p className="text-xs font-medium text-zinc-800">Be sure to check your spam folder !</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pb-6 pl-0 pr-0">
                    <Link href="/" className={buttonVariants({
                        className: 'w-full ',
                        variant: 'default'
                    })}>
                        <ArrowLeft className="size-4 mr-2"/> Back to homepage
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}