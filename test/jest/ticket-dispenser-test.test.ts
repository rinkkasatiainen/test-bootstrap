import TicketDispenser from '../../src/turn-ticket-dispenser/ticket-dispenser'

describe('Turn Ticket Dispenser', () => {

    describe('TurnTicketDispenser', () => {

        it('foo', () => {
            const dispenser = new TicketDispenser()
            const ticket = dispenser.getTurnTicket()
            expect(ticket.getTurnNumber()).toEqual(-1)
        })

    })

})
