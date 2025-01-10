"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import {Loader2} from 'lucide-react'

export default function SubmitButton({placeholder}: {placeholder?:string}) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="bg-gradient-to-b from-[#37373c] to-[#232328] text-neutral-300 w-full">
            <Loader2 className="size-4 mr-2 animate-spin"/>
          Please wait...
        </Button>
      ) : (
        <Button
          type="submit"
          // className="bg-gradient-to-b font-semibold from-[#37373c] to-[#232328] text-neutral-300 hover:from-[#5b5b60]"
          className="bg-neutral-50 text-matt2 hover:bg-zinc-300"
        >
          {placeholder ? placeholder : 'Submit'}
        </Button>
      )}
    </>
  );
}
