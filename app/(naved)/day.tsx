import { addOrder, getDayOrders, handleDone, Item } from "@/libs/queries"
import { Loader2, Pencil, PenOff, X } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import Edit from "./edit"

interface Day {
    date: {year: number, month: number},
    setDay: (day:number | null)=>void,
    day: number,
    handleFetchMonth: () => void
}

const weekdays = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]

const Day = ({
    date,
    setDay,
    day,
    handleFetchMonth
}:Day) => {

    const currentDate = new Date(date.year, date.month, day)

    const [isEditing, setIsediting] = useState<boolean>(false)
    const [editing, setEditing] = useState<Item | null>(null)
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [time, setTime] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<Item[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const fetchData = async () => {
        if(!isLoading) setIsLoading(true)
        const res = await getDayOrders(date.year, date.month, day)
        
        if(!res){
            toast('Um erro ocorreu a carregar a informação!')
            console.error('Error fetching day info!')
        }else{
            setData(res)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()

    },[date, day]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const numberAmount = parseInt(amount)
        
        if(name.trim() == '' || numberAmount <= 0 || time == '') {
            toast.error('Preencha todos os campos de forma válida')
            return
        }
        setIsUploading(true)
        const res = await addOrder(name, numberAmount, time, date.year, date.month, day)
        if(res == null) toast.error('Erro a adicionar!')
            else{
        setName('')
        setAmount('')
        setTime('')
        toast.success('Adicionado')
        handleFetchMonth()
        fetchData()
    }
        setIsUploading(false)
    }

    const handleClose = () => {
        setDay(null)
        setIsediting(false)
        setEditing(null)
    }
    
    const handleEditing = () => {
        setIsediting(prev => !prev)
        setEditing(null)
    }

    const done = async (orderId: number, done: boolean) => {
        setIsLoading(true)
        const res = await handleDone(orderId, done)
        if(!res) toast('Error a alterar o estado da encomenda!')
        fetchData()
    }

    const handleOrderClick = (order: Item) => {
        if(!isEditing) return
        setEditing(order)
    }

    return (
        <>
            <div onClick={handleClose} className="z-20 bg-black/20 backdrop-blur-sm inset-0 fixed" />
            <div className="fixed z-30 rounded-xl inset-0 m-auto w-full max-w-96 max-h-full aspect-[9/16] bg-zinc-900 flex flex-col justify-start items-center gap-2 p-7">
                <button className="absolute top-2 right-2" onClick={handleClose}><X size={20} /></button>
                <div className="flex justify-between items-center w-full pb-3 border-b border-dashed">
                    <div className="flex justify-center items-end gap-2">
                        <p className="font-bold  text-xl">{day}</p>
                        <p>{weekdays[currentDate.getDay()]}</p>
                    </div>
                    <button onClick={handleEditing}>{isEditing ? <PenOff size={20} /> : <Pencil size={20} />}</button>
                </div>
                <p className="w-full">{day}/{date.month}/{date.year}</p>
                <div className="flex-grow w-full flex flex-col justify-start items-center gap-2 overflow-y-auto">
                    {isLoading ? <div className="flex flex-grow justify-center items-center">
                        <Loader2 size={75} strokeWidth={1} className="animate-spin" />
                    </div> : data.map((order, i) => {
                        const time = order.time.split(':')
                        return (
                            <div onClick={() => handleOrderClick(order)} key={order.id} className={`w-full flex justify-between py-3 relative rounded-md ${isEditing && 'animate-pulse'} ${isEditing && 'cursor-pointer'} ${i != data.length - 1 && 'border-b border-zinc-600'}`}>
                            <div className="flex justify-center items-center gap-2">
                                <input type="checkbox" checked={order.done} onChange={()=>{if(!isEditing)(done(order.id, !order.done))}} />
                                <p className={`w-44 text-nowrap overflow-hidden text-ellipsis ${order.comment && order.comment != '' && 'underline underline-offset-2'}`}>{order.name}</p>
                            </div>
                            <div className="flex justify-center items-center gap-2">
                                {order.paid && <>
                                    <p>Pago</p>
                                    <p>|</p>
                                </>}
                                <p>{order.amount}</p>
                                <p>|</p>
                                <p>{time[0]}:{time[1]}</p>
                            </div>
                            {order.done && <div className="absolute right-0 w-[95%] my-auto inset-y-0 h-1 bg-red-500/70 rounded-full" />}
                            </div>
                    )})}
                </div>
                <form onSubmit={(e)=>handleSubmit(e)} className="grid grid-cols-6 justify-center items-center gap-1">
                    <div className="col-span-4">
                        <label className="text-sm font-light">Nome:</label>
                        <input type="text" placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)}
                            className="bg-zinc-700 text-white w-full py-1 px-2 rounded-lg font-semibold" />
                        </div>
                    <div className="col-span-2">
                        <label className="text-sm font-light">Quantidade:</label>
                        <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)}
                            className="w-full bg-zinc-700 border-none font-semibold rounded-lg py-1 px-2 text-white text-center" placeholder="Quantidade" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-light">Horas:</label>
                        <input type="time" value={time} onChange={(e)=>setTime(e.target.value)}
                            className="bg-zinc-700 w-full border-none font-semibold rounded-lg text-white py-1 px-2 text-center" />
                    </div>
                    <div className="flex h-full items-end col-span-4">
                        <button disabled={isUploading} type="submit" className="bg-blue-600 py-2 w-full rounded-lg">{isUploading ? <Loader2 size={20} strokeWidth={1} className="animate-spin" /> : <p>Adicionar</p>}</button>
                    </div>
                </form>
            </div>
            {editing && <Edit handleClose={() => setEditing(null)} order={editing} fetchData={fetchData} />}
        </>
    )
}
export default Day