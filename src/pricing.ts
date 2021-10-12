export interface Ticket {
    age: number;
    ticketType: string;
    date: string;
}

export interface Cost {
    cost: number;
}

export type Holidays = Array<{ holiday: Date }>

export async function calculatePrice(
    getBasePriceFor: () => Promise<Cost>, ticket: Ticket, getHolidays: () => Promise<Holidays>) {
    const basePrice = (await getBasePriceFor())
    if (ticket.age < 6) {
        return {cost: 0}
    } else {
        if (ticket.ticketType !== 'night') {
            const holidays = (await getHolidays())

            let isHoliday
            let reduction = 0
            for (const row of holidays) {
                const holiday = row.holiday
                if (ticket.date) {
                    const d = new Date(ticket.date)
                    if (d.getFullYear() === holiday.getFullYear()
                        && d.getMonth() === holiday.getMonth()
                        && d.getDate() === holiday.getDate()) {

                        isHoliday = true
                    }
                }

            }

            if (!isHoliday && new Date(ticket.date).getDay() === 1) {
                reduction = 35
            }

            // TODO apply reduction for others
            if (ticket.age < 15) {
                return {cost: Math.ceil(basePrice.cost * .7)}
            } else {
                if (ticket.age === undefined) {
                    const cost = basePrice.cost * (1 - reduction / 100)
                    return {cost: Math.ceil(cost)}
                } else {
                    if (ticket.age > 64) {
                        const cost = basePrice.cost * .75 * (1 - reduction / 100)
                        return {cost: Math.ceil(cost)}
                    } else {
                        const cost = basePrice.cost * (1 - reduction / 100)
                        return {cost: Math.ceil(cost)}
                    }
                }
            }
        } else {
            if (ticket.age >= 6) {
                if (ticket.age > 64) {
                    return {cost: Math.ceil(basePrice.cost * .4)}
                } else {
                    return basePrice
                }
            } else {
                return {cost: 0}
            }
        }
    }
}