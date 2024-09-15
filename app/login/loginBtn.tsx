'use client'

import Image from "next/image"
import { signIn } from "next-auth/react"
import Button from "@/components/button"


const LoginButton = () => {

    

    return (
        <Button
         onClick={()=>signIn("google")}>
            <>
                <Image
                  src="/google.svg"
                  width={25}
                  height={25}
                  alt="Google Icon"
                  priority
                />
                <p>Entrar com a conta Google</p>
            </>
        </Button>
    )
}
export default LoginButton