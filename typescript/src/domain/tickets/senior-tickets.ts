import {Ticket, TicketPrice} from '../ticket'

export class SeniorTickets implements Ticket {

    public withBasePrice(basePrice: TicketPrice): { forDate: (date: string) => Promise<TicketPrice> } {
        return {
            forDate: async (date) => {
                let reduction = 0
                if (new Date(date).getDay() === 1) {
                    reduction = 35
                }
                return Promise.resolve({cost: Math.ceil(basePrice.cost * .75 * (1 - reduction / 100))})
            },
        }
    }
}
