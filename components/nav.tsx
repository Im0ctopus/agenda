'use client'

import { signOut } from "next-auth/react"

const Nav = () => {

    return (
        <div className="flex w-full justify-end items-center p-3">
            <button onClick={()=>signOut()} className="px-2 py-1">
                <p>Sair</p>
            </button>
        </div>
    )
}
export default Nav