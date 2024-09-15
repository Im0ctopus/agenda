import { sql } from "@vercel/postgres"
import withAuth from "next-auth/middleware"

export const getRoleEmail = async (email: string) => {
  const emails = await sql`SELECT email FROM public."Users";
  `
  const res = emails.rows.filter(e=>e.email == email)
  return res.length > 0
}

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: async ({ token }) => await getRoleEmail(token?.email!),
  },
  pages: {
    signIn: '/login',
  },
})

export const config = { matcher: ['/'] }