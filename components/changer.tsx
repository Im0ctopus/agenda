import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useState } from "react"

const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]

const Changer = ({handleChange, month, year}:{year: number, month: number, handleChange: (year:number, month:number)=>void}) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedYear, setSelectedYear] = useState(year)

    const handleClose = () => {
        setSelectedYear(year)
        setIsOpen(false)
    }

    useEffect(() => {
        setSelectedYear(year)
    },[year]);

    return (
        <>
            <button onClick={()=>setIsOpen(true)} className="flex flex-col justify-center items-center gap-1 mb-3 w-full">
              <h2 className="text-center text-xl">{year}</h2>
              <h2 className="text-xl capitalize w-fit">{months[month]}</h2>
            </button>
            {isOpen && <>
                <div className="fixed z-20 inset-0 bg-black/10 backdrop-blur-sm" onClick={handleClose}/>
                <div className="fixed z-30 bottom-0 inset-x-0 bg-zinc-900 p-3 py-10">
                    <div className="flex flex-col justify-center items-center gap-5 max-w-96 mx-auto">
                        {/* <div className="w-full flex justify-end"><button className="rounded-full p-1" onClick={handleClose}><X/></button></div> */}
                        <div className="flex justify-between items-center w-full">
                            <button onClick={()=>setSelectedYear( selectedYear - 1)}><ChevronLeft/></button>
                            <p>{selectedYear}</p>
                            <button onClick={()=>setSelectedYear( selectedYear + 1)}><ChevronRight/></button>
                        </div>
                        <div className="w-fit grid gap-3 grid-cols-4 justify-center items-center">
                            {[...Array(12)].map((_,i)=><button key={i} className={`aspect-square rounded-full border w-12 ${(month === i  && selectedYear === year)? 'bg-blue-600 border-blue-600' : 'bg-zinc-700'}`} onClick={()=>{handleChange( selectedYear, i); setIsOpen(false)}}>{months[i].substring(0,3)}.</button>)}
                        </div>
                    </div>
                </div>                
            </>}
        </>
    )
}
export default Changer