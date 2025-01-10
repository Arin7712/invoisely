import { notFound } from "next/navigation";
import { UpdateUserRoute } from "../components/UpdateUser";
import prisma from "../utils/db";
import RequireUser from "../utils/hooks";

async function getData(userId: string){
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if(!data){
        return notFound();
    }

    return data;
}

export default async function Update(){
    const session = await RequireUser();
    const data = await getData(session.user?.id as string)

    return(
        <div>
            <UpdateUserRoute data={data}/>
        </div>
    )
}