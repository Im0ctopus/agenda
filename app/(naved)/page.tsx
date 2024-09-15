'use client'

import { useEffect, useState } from 'react'
import { handleClick, handleDays } from '@/libs/utils'
import Changer from '@/components/changer'
import { Loader2 } from 'lucide-react'
import Day from './day'
import { getMonthOrders } from '@/libs/queries'
import { toast } from 'sonner'

const weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

const Page = () => {
  const currentDate = new Date()
  const [date, setDate] = useState<{ year: number; month: number }>({ year: currentDate.getFullYear(), month: currentDate.getMonth() })
  const [showDays, setShowDays] = useState<{ number: number; current: 'before' | 'current' | 'after' }[]>(handleDays(date.year, date.month))
  const [isLoading, setIsLoading] = useState(true)
  const [day, setDay] = useState<number | null>(null)
  const [data, setData] = useState<{day: number, item_count:number}[]>([])

  const handleFetchItems = async () => {
    if(!isLoading) setIsLoading(true)
      
    const newData = await getMonthOrders(date.year, date.month)
  
    if(!newData) {
      toast('Um erro ocorreu a carregar a informação!')
      console.error('Error fetching info!')
    }else{
      setData(newData)
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    
    handleFetchItems()

  }, [date.month, date.year, day])

  const handleChange = (year: number, month: number) => {
    setDate({ year: year, month: month })
    setShowDays(handleDays(year, month))
  }

  return (
    <>
      {isLoading ? (
        <div className="flex-grow flex justify-center items-center">
          <Loader2 size={75} strokeWidth={1} className="animate-spin" />
        </div>
      ) : (
        <div className="p-3 pt-0 max-w-[700px] mx-auto w-full">
          <Changer handleChange={handleChange} month={date.month} year={date.year} />
          <div className="grid justify-center items-center w-full gap-0 grid-cols-7 mx-auto">
            {weekdays.map((day) => (
              <p key={day} className="capitalize text-center w-full text-sm">
                {day}
              </p>
            ))}
          </div>
          <div className="grid justify-center items-center w-full gap-0 grid-cols-7 mx-auto">
            {showDays.map((day, i) => (
              <button
                onClick={() => handleClick(day, handleChange, date.year, date.month, setDay)}
                key={i.toString()}
                className={`col-span-1 w-full aspect-[9/16] flex flex-col justify-start items-center border-t border-zinc-500`}
              >
                <p className={`${day.current != 'current' && 'opacity-50'}`}>{day.number}</p>
                {day.current === 'current' && data.find(d => d.day == day.number) && 
                  <div className='flex-grow flex justify-center items-center w-full'>
                    <p className='bg-blue-600 w-10 aspect-square rounded-full flex justify-center items-center'>{data.find(d => d.day == day.number)?.item_count}</p>
                  </div>
                }
              </button>
            ))}
          </div>
        </div>
      )}
      {day != null && <Day date={date} setDay={setDay} day={day} handleFetchMonth={handleFetchItems} />}
    </>
  )
}
export default Page
