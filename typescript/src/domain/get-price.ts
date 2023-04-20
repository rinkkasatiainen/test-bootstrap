// Domain concepts - value objects
export interface TicketPrice {
    cost: number;
}

interface Holiday {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
}

// Repository functions
export type GetBasePrice = (liftPassType: string) => Promise<TicketPrice>
export type GetHolidays = () => Promise<Array<{ holiday: Holiday }>>
// Domain functions
type CalculatesPrice = (liftPassType: string, age: number, date: string) => Promise<TicketPrice>


interface Ticket {
    withBasePrice: (basePrice: TicketPrice) => {
        forDate: (date: Date) => TicketPrice;
    };
}

const getTicket: (liftPassType: string, age: number) => Ticket | undefined =
    (liftPassType: string, age: number) => {
        if (age < 6) {
            const newVar: Ticket = {withBasePrice: () => ({forDate: () => ({cost: 0})})}
            return newVar
        }
        if (liftPassType === 'night') {
            return {
                withBasePrice: basePrice => ({
                    forDate: () => age > 64 ? {cost: Math.ceil(basePrice.cost * .4)} : basePrice,
                }),
            }
        }
        return undefined
    }

const isHolidayOn: (listHolidays: GetHolidays) => (date: string) => Promise<boolean> =
    listHolidays => async (date: string) => {
        const holidays = await listHolidays()
        let isHoliday = false
        for (const row of holidays) {
            // eslint-disable-next-line max-len
            const holiday = row.holiday as unknown as Holiday
            if (date) {
                const d = new Date(date)
                if (d.getFullYear() === holiday.getFullYear()
                    && d.getMonth() === holiday.getMonth()
                    && d.getDate() === holiday.getDate()) {
                    isHoliday = true
                }
            }
        }
        return isHoliday
    }

export const getPrice:
    (basePriceFor: GetBasePrice, listHolidays: GetHolidays) => CalculatesPrice =
    (basePriceFor, listHolidays) => async (liftPassType, age, date) => {
        const basePrice: TicketPrice = await basePriceFor(liftPassType)
        // Create a new Bonsai tree branch
        const ticket = getTicket(liftPassType, age)
        if (ticket !== undefined) {
            // if there is a ticket, use that. otherwise, use the legacy code path
            return ticket.withBasePrice(basePrice).forDate(new Date(date))
        }
        let reduction = 0

        const isHoliday = await isHolidayOn(listHolidays)(date)
        if (!isHoliday && new Date(date).getDay() === 1) {
            reduction = 35
        }

        if (age < 15) {
            return {cost: Math.ceil(basePrice.cost * .7)}
        } else {
            if (age === undefined) {
                const cost = basePrice.cost * (1 - reduction / 100)
                return {cost: Math.ceil(cost)}
            } else {
                if (age > 64) {
                    const cost = basePrice.cost * .75 * (1 - reduction / 100)
                    return {cost: Math.ceil(cost)}
                } else {
                    const cost = basePrice.cost * (1 - reduction / 100)
                    return {cost: Math.ceil(cost)}
                }
            }
        }
    }
