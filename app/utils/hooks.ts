import { redirect } from "next/navigation";
import { auth } from "./auth";

export default async function RequireUser(){
    const session = await auth();

    if(!session?.user)
        redirect('/login')
    return session;
}