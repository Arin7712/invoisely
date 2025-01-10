"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";


interface iAppProps {
    data: {
        date: string,
        amount: number
    }[]
}

export function Graph({data} : iAppProps){
    return(
        <ChartContainer config={{
            amount: {
                label: "Amount",
                color: '#787985'
            }
        }} className="min-h-[300px]">
            <ResponsiveContainer width={100} height={100}>
                <LineChart data={data} className="text-gray1">
                    <XAxis fill="#787985" dataKey="date"/>
                    <YAxis fill="#787985"/>
                    <ChartTooltip content={<ChartTooltipContent indicator="line" className="text-gray1"/>}/>
                    <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={2} className="text-gray1"/>
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}