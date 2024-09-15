'use server'

import { sql } from "@vercel/postgres"
import { getServerSession } from "next-auth"

export const getUserId = async () => {
    const session = await getServerSession()

    if(!session || !session.user || !session.user.email) return null

    const email = session.user.email

    const res = await sql`SELECT Id
        FROM public."Users"
        WHERE Email = ${email};
    `
    if(!res.rowCount) return null
    return res.rows[0].id as unknown as number
}

export const addOrder = async (name: string, amount: number, time: string, year: number, month: number, day: number) => {
    const userId = await getUserId()
    if(!userId) return null

    const res = await sql`INSERT INTO public."Items" (Userid, Name, YEAR, MONTH, DAY, TIME, Amount)
        VALUES (${userId}, ${name}, ${year}, ${month}, ${day}, ${time}, ${amount})
        RETURNING Id;`

    if(!res.rowCount) return null

    return res.rows[0] as unknown as number
}

export const getMonthOrders = async (year: number, month: number) => {
    try{
        const res = await sql`SELECT DAY, COUNT(*) AS item_count
            FROM public."Items"
            WHERE YEAR = ${year}
            AND MONTH = ${month}
            GROUP BY DAY
            ORDER BY DAY;
        `

        return res.rows as {day:number, item_count: number}[]
    }catch(error){
        console.error(error)

        return null
    }
}

export interface Item {
    id: number;
    userId: number;
    name: string;
    year: number;
    month: number;
    day: number;
    time: string;  // Time in "HH:MM:SS" format
    amount: number;
    comment: string | null;
    done: boolean;
    paid: boolean;
}

export const getDayOrders = async (year: number, month: number, day:number) => {
    try{
        const res = await sql`SELECT *
            FROM public."Items"
            WHERE YEAR = ${year}
            AND MONTH = ${month}
            AND DAY = ${day}
            ORDER BY Paid ASC, TIME ASC, Name ASC;`
        
            return res.rows as Item[]

    }catch(error){
        console.error(error)

        return null
    }
}

export const handleDone = async (orderId: number, done: boolean) => {
    try{
        const res = await sql`UPDATE public."Items"
            SET Done = ${done}
            WHERE Id = ${orderId}
            RETURNING Id;`
        return res.rowCount
    }catch(error){
        console.error(error)
        return null
    }
}

export const deleteOrder = async (orderId: number) => {
    try{
        const res = await sql`DELETE FROM public."Items"
            WHERE Id = ${orderId}
            RETURNING Id;
        `
        return res.rows[0]
    }catch(error){
        console.error(error)
        return null
    }
}

export const editOrder = async (itemId: number, day: number, month: number, name: string, amount: number, time: string, comment: string, paid: boolean) => {
    try{const res = await sql`UPDATE public."Items"
        SET
            Name = ${name},
            MONTH = ${month},
            DAY = ${day},
            TIME = ${time},
            Amount = ${amount},
            Comment = ${comment},
            Paid = ${paid}
        WHERE Id = ${itemId}
        RETURNING Id;`
    return res.rowCount
    }catch(error){
        console.error(error)
        return null
    }
}