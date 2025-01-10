import Link from "next/link";
import RequireUser from "../utils/hooks";
import Logo from "@/public/logo.png";
import Image from "next/image";
import DashBoardLinks from "../components/DashBoardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, Users2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "../utils/auth";
import prisma from "../utils/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

async function getUser(userId: string){
  const data = await  prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      firstName: true,
      lastName: true,
      email: true
    },
  });

  if(!data?.firstName || !data?.lastName || !data?.email){
    redirect('/onboarding')
  } 
}

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await RequireUser();
  const data = await getUser(session.user?.id as string)

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] bg-matt3 lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r-[1px] border-zinc-700 bg-matt3 md:block">
          <div className="flex flex-col max-h-screen h-full gap-2">
            <div className="h-14 flex items-center border-b border-zinc-700 px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="logo"
                  className="size-7"
                  width={100}
                  height={100}
                />
                <p className="text-neutral-300 text-xl font-bold">
                  Invoice <span className="text-gray1">Arin</span>
                </p>
              </Link>
            </div>
            <div className="flex-1 ">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <DashBoardLinks />
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b border-zinc-700 bg-matt3 lg:h-[60px] lg:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant='outline' size="icon" className="md:hidden ml-2 bg-matt3 border-zinc-700 text-neutral-300 hover:bg-matt2 hover:text-neutral-300">
                            <MenuIcon className="size-5 "/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-2 mt-10">
                            <DashBoardLinks/>
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex items-center ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-full bg-matt2 hover:bg-matt1 hover:text-neutral-300 border-zinc-700 text-neutral-300" variant="outline" size="icon">
                                <Image src={session.user?.image || ''} alt='user' width={45} height={45} className="size-full rounded-full"/>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <Link href="/update">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/invoices">Invoices</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <form className="w-full" action={async() => {
                                    "use server";
                                    await signOut();
                                }}>
                                    <button className="w-full text-left">Log out</button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </div>
      </div>
      <Toaster richColors closeButton/>
    </>
  );
}
