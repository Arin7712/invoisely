import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  return (
    <div className="flex px-[4rem] w-full items-center z-50 top-0 fixed justify-between py-5 bg-black bg-opacity-45">
      <h1 className="font-bold text-neutral-300 text-2xl">Invoisely</h1>

      <div className="md:block hidden">
        <ul className="flex gap-[3rem] items-center text-neutral-300">
          <li>Home</li>
          <li>Features</li>
          <li>Pricing</li>
          <li>FAQ'S</li>
          <li>Changelog</li>
        </ul>
      </div>

      <div>
        <Button className="bg-matt2 border-zinc-700 border-[1px]">Login</Button>
      </div>

      <div className="md:hidden block">
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
