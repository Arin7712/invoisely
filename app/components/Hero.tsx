import { AvatarCirclesDemo } from "@/components/AvatarCirclesDemo";
import AvatarCircles from "@/components/ui/avatar-circles";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

export function Hero(){

  const count = 5;
  const headers = Array.from({length: count}).map((_, index) => (
    <Star key={index} className="size-5" color="gray"/>
  ))
    return(
        <section className="flex p-8 md:p-0 flex-col gap-[2.5rem] md:gap-[2.2rem] md:items-center justify-between mt-[7rem] py-12 lg:py-20">
            <div className="text-neutral-300 bg-neutral-900 border-[1px] inline-block  uppercase border-zinc-700 px-3 py-1.5 rounded-md text-xs font-semibold">
              <p >Invoice management was never easier</p>
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl text-neutral-200 w-full md:max-w-4xl md:text-center md:translate-x-4">
                <span className="font-bold">
                A Management System,<br/>
                </span>
                <span className="text-neutral-500 font-light italic">
                 designed for you.
                </span>
                </h1>
            </div>
            <div className="md:max-w-3xl max-w-xl md:text-center text-stone-300 text-lg">
              <p>
              Take a back seat in your next Marketing Campaign and let AI do all the heavy lifting for you.
              </p>
            </div>

            <div className="flex gap-6 items-center">
              <Button className="bg-neutral-900 border-zinc-800 border-[1px] px-6 text-lg py-5">
                Start free trail
              </Button>
              <Button className="bg-black text-white border-zinc-800 border-[1px] px-6 text-lg hover:text-white py-5">
                Learn more
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <AvatarCirclesDemo/>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {headers}
                </div>
              <p className="text-neutral-300/60">Trusted by 100+ monthly users</p>
              </div>
            </div>

            <div className="border-zinc-700 border-[1px] rounded-xl mt-10">
            <Image src="/invoiselymockup.png" alt="image" width={1200} height={574} className="object-cover w-full h-full rounded-xl"/>
            </div>
        </section>
    )
}