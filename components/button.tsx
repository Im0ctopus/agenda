import { ReactElement } from "react"

const Button = ({children, onClick, classname}:{children:ReactElement, onClick:()=>void, classname?: string}) => {

    

    return (
        <button
         onClick={onClick}
         className={`${classname??''} bg-white text-black px-4 py-2 rounded-xl text-xl font-semibold active:bg-zinc-100 transition-all active:scale-95 flex justify-center items-center gap-2`}>
            {children}
        </button>
    )
}
export default Button