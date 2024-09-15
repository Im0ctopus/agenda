import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LoginButton from './loginBtn'
import { sql } from '@vercel/postgres'
// import { redirect } from 'next/dist/server/api-utils'

const Page = async () => {

    const session = await getServerSession()

    // Logged user is redirected to the main page
    if(session?.user){
        const verifyEmail = async () => {
        const emails = await sql`SELECT email FROM public."Users";`
        const res = emails.rows.filter(e=>e.email == session.user?.email)
        return res.length > 0
        }

        if(await verifyEmail()){
            redirect('/')
        }
    }

    return (
        <div className="flex-grow flex flex-col justify-center items-center">
            <LoginButton/>
        </div>
    )
}
export default Page