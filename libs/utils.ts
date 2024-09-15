
export const getDaysInMonth = (year:number, month:number) => {
    return new Date(year, month+1, 0).getDate();
}

export const handleDays = (year:number, month:number) =>{
    const monthDays = getDaysInMonth(year,month)
    const lastMonthDays = getDaysInMonth(year, (month - 1) < 0 ? 11 : month - 1)
    const firstDayDate = new Date(year,month,1)
    const firstDay = firstDayDate.getDay()
    let finalDays = 35 - (firstDay + monthDays)
    if(finalDays < 0) finalDays = 7 + finalDays
    let showDays:{number:number, current:'before'|'current'|'after'}[] = [...Array(firstDay)].map((_,i)=>({number: lastMonthDays - (firstDay - (i + 1)), current:'before'}))
    showDays = [...showDays, ...[...Array(monthDays)].map((_,i)=>({number:i+1, current:'current' as 'before'|'current'|'after'}))]
    showDays = [...showDays, ...[...Array(finalDays)].map((_,i)=>({number:i+1,current:'after' as 'before'|'current'|'after'}))]
    return showDays
}

export const handleClick = (day: {number:number, current:'before'|'current'|'after'}, handleChange: (year:number, month: number)=>void, currentYear:number, currentMonth:number, setDay:(day:number)=>void) => {


    if(day.current === 'current'){
        setDay(day.number)
    }else if(day.current === 'before'){
        if(currentMonth - 1 >= 0) handleChange(currentYear, currentMonth - 1)
        else handleChange(currentYear - 1, 11)
    }else{
        if(currentMonth + 1 <= 11) handleChange(currentYear, currentMonth + 1)
        else handleChange(currentYear + 1, 0)
    }
}