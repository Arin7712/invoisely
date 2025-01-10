// This route is accessible to the user who are authenticated

import { redirect } from "next/navigation";
import { auth, signOut } from "../utils/auth"
import RequireUser from "../utils/hooks";
import { DashBoardBlocks } from "../components/DashBoardBlocks";
import { InvoiceGraph } from "../components/InvoiceGraph";
import { RecentInvoices } from "../components/RecentInvoices";
import prisma from "../utils/db";
import { EmptyState } from "../components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import Image from "next/image";

async function getData(userId: string){
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId
    },
    select: {
      id: true
    }
  });

  return data;
}

export default async function DashboardRoute(){
    const session = await RequireUser();

    const data = await getData(session.user?.id as string);

    return(
      <>
      {data.length < 1 ? <EmptyState title="No Invoice Found" description="Create an invoice to get started."/>
      : 
      <Suspense fallback={<Skeleton className="w-full h-full flex-1"/>}>
      <DashBoardBlocks/>
      <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
        <InvoiceGraph/>
        <RecentInvoices/>
      </div>
      </Suspense>
      }
      
      </>
    )
}