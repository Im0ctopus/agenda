import { deleteOrder, editOrder, Item } from "@/libs/queries"
import { getDaysInMonth } from "@/libs/utils"
import { X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Edit {
    order: Item
    handleClose: () => void
    fetchData: () => void
}

const Edit: React.FC<Edit> = ({
    order,
    handleClose,
    fetchData
}) => {
    const [name, setName] = useState<string>(order.name)
    const [amount, setAmount] = useState<string>(order.amount.toString())
    const [time, setTime] = useState<string>(order.time)
    const [comment, setComment] = useState<string>(order.comment ?? '')
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [day, setDay] = useState<string>(order.day.toString())
    const [month, setMonth] = useState<string>((order.month + 1).toString())
    const [paid, setPaid] = useState<boolean>(order.paid)

    const handleDelete = async () => {
        const res = await deleteOrder(order.id)
        if(res) {
            toast.success('Encomenda apagada com sucesso')
            await fetchData()
            handleClose()
        }
        else toast.error('Erro a tentar apagar encomenda')
    }

    const handleSave = async () => {
        if(parseInt(day) == 0 || parseInt(month) == 0 || name.trim() == '' || parseInt(amount) == 0 || time.trim() == ''){
            toast.error('Insira os campos obrigatorios')
            return
        }
        const res = await editOrder(order.id, parseInt(day), parseInt(month) - 1, name, parseInt(amount), time, comment, paid)
        if(!res) toast.error("Erro a editar a encomenda")
        else {
            toast.success("Eoncomenda alterada")
            handleClose()
            fetchData()
        }
    }

    const handleDay = (dayString: string) => {
            const day = parseInt(dayString)
            const daysInMonth = getDaysInMonth(new Date().getFullYear(), parseInt(month) -1)
            
            if(day <= 0)setDay('1')
                else if(!month)toast.error("Insira o mês primeiro")
            else if(day > daysInMonth) setDay(daysInMonth.toString())
        else setDay(day.toString())
}

    const handleMonth = (monthString: string) => {
        const month = parseInt(monthString)
        const daysInMonth = getDaysInMonth(new Date().getFullYear(), month - 1)

        if(month > 12) setMonth('12')
        else if(month <= 0) setMonth('1')
        else {
            setMonth(monthString)
            if(parseInt(day) > daysInMonth) setDay(daysInMonth.toString())
        }
    }

    return (
        <>
            <div onClick={handleClose} className="fixed z-40 inset-0 backdrop-blur-sm bg-black/40" />
            <div className="fixed z-50 inset-0 m-auto w-full max-w-96 bg-zinc-900 h-fit p-7 grid grid-cols-12 gap-3 rounded-xl">
                <button className="absolute top-2 right-2" onClick={handleClose}><X size={20} /></button>
                <div className="col-span-10">
                    <label className="text-sm font-light">Nome:</label>
                    <input type="text" placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)}
                        className="bg-zinc-700 text-white w-full py-1 px-2 rounded-lg font-semibold" />
                </div>
                <div className="col-span-2 flex justify-center items-center mt-7 gap-1">
                    <label className="text-sm font-light">Pago:</label>
                    <input type="checkbox" checked={paid} onChange={() => setPaid(prev => !prev)} />
                </div>
                <div className="col-span-6">
                    <label className="text-sm font-light">Dia:</label>
                    <input type="number" placeholder="Dia" value={day?.toString()} onChange={(e) => handleDay(e.target.value)}
                        className="bg-zinc-700 text-white w-full py-1 px-2 rounded-lg font-semibold text-center" />
                </div>
                <div className="col-span-6">
                    <label className="text-sm font-light">Mês:</label>
                    <input type="number" value={month?.toString()} onChange={(e)=> handleMonth(e.target.value)} placeholder="Mês"
                        className="bg-zinc-700 w-full border-none font-semibold rounded-lg text-white py-1 px-2 text-center" />
                </div>
                <div className="col-span-6">
                    <label className="text-sm font-light">Quantidade:</label>
                    <input type="number" placeholder="Quantidade" value={amount} onChange={(e)=>setAmount(e.target.value)}
                        className="bg-zinc-700 text-white w-full py-1 px-2 rounded-lg font-semibold text-center" />
                </div>
                <div className="col-span-6">
                    <label className="text-sm font-light">Horas:</label>
                    <input type="time" value={time} onChange={(e)=>setTime(e.target.value)}
                        className="bg-zinc-700 w-full border-none font-semibold rounded-lg text-white py-1 px-2 text-center" />
                </div>
                <div className="col-span-12">
                    <label className="text-sm font-light">Comentário:</label>
                    <textarea rows={3} value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Comentario opcional"
                        className="bg-zinc-700 w-full border-none font-semibold rounded-lg text-white py-1 px-2 resize-none" />
                </div>
                <div className="col-span-12 flex justify-between items-center">
                    <button onClick={() => setIsDelete(true)} className="bg-red-600 p-2 rounded-lg">Apagar</button>
                    <div className="flex justify-center items-center gap-2">
                    <button onClick={handleClose} className="bg-zinc-600 p-2 rounded-lg">Cancelar</button>
                    <button onClick={handleSave} className="bg-blue-600 p-2 rounded-lg">Salvar</button>
                    </div>
                </div>
                {isDelete && <div className="col-span-12 flex flex-col gap-3">
                        <h3>Quer apagar esta encomenda?</h3>
                        <div className="flex justify-between items-center">
                            <button onClick={() => setIsDelete(false)} className="bg-zinc-600 p-2 rounded-lg">Cancelar</button>
                            <button onClick={handleDelete} className="bg-red-600 p-2 rounded-lg">Apagar</button>
                        </div>
                    </div>}
            </div>
        </>
    )
}
export default Edit