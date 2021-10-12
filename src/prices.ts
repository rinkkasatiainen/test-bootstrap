import express, {Application, Request, Response} from 'express'
import mysql from 'mysql2/promise'
import {RowDataPacket} from 'mysql2'

interface Ticket { age: number; ticketType: string; date: string }

export async function createApp() {
    const app: Application = express()

    const connectionOptions = {host: 'localhost', user: 'root', database: 'lift_pass', password: 'mysql'}
    const connection = await mysql.createConnection(connectionOptions)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.put('/prices', async (req: Request, res: Response) => {
        const liftPassCost = req.query.cost
        const liftPassType = req.query.type
        await connection.query(
            'INSERT INTO `base_price` (type, cost) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE cost = ?',
            [liftPassType, liftPassCost, liftPassCost])

        res.json()
    })

    async function getPrice(getBasePriceFor: () => Promise<RowDataPacket[][]>, ticket: Ticket, getHolidays: () => Promise<RowDataPacket[]>) {
        const newVar: RowDataPacket[][] = await getBasePriceFor()
        const result = newVar[0][0]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (ticket.age < 6) {
            return {cost: 0}
        } else {
            if (ticket.ticketType !== 'night') {
                // TODO: AkS: This is a nasty hack
                const newVar1: RowDataPacket[] = await getHolidays()
                const holidays = newVar1[0]

                let isHoliday
                let reduction = 0
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                for (const row of holidays) {
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    const holiday = row.holiday
                    if (ticket.date) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const d = new Date(ticket.date)
                        // eslint-disable-next-line max-len
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                        if (d.getFullYear() === holiday.getFullYear()
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                            && d.getMonth() === holiday.getMonth()
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                            && d.getDate() === holiday.getDate()) {

                            isHoliday = true
                        }
                    }

                }

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (!isHoliday && new Date(ticket.date).getDay() === 1) {
                    reduction = 35
                }

                // TODO apply reduction for others
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (ticket.age < 15) {
                    return {cost: Math.ceil(result.cost * .7)}
                } else {
                    if (ticket.age === undefined) {
                        const cost = result.cost * (1 - reduction / 100)
                        return {cost: Math.ceil(cost)}
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (ticket.age > 64) {
                            const cost = result.cost * .75 * (1 - reduction / 100)
                            return {cost: Math.ceil(cost)}
                        } else {
                            const cost = result.cost * (1 - reduction / 100)
                            return {cost: Math.ceil(cost)}
                        }
                    }
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (ticket.age >= 6) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (ticket.age > 64) {
                        return {cost: Math.ceil(result.cost * .4)}
                    } else {
                        return result
                    }
                } else {
                    return {cost: 0}
                }
            }
        }
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.get('/prices', async (req: Request, res: Response) => {
        // TODO: AkS: This is a nasty hack.
        const getHolidays = async () => await connection.query(
            'SELECT * FROM `holidays`'
        ) as RowDataPacket[]
        const getBasePriceFor = async () => await connection.query(
            'SELECT cost FROM `base_price` ' +
            'WHERE `type` = ? ',
            [req.query.type]) as RowDataPacket[][]

        if (!(!!req.query.age && !!req.query.type && !!req.query.date)) {
            res.json({})
            return
        }
        const ticket: Ticket = {
            age: parseInt((req.query.age as string), 10),
            ticketType: req.query.type as string,
            date: req.query.date as string,
        }


        const price = await getPrice(getBasePriceFor, ticket, getHolidays)
        res.json(price)
    })
    return {app, connection}
}
