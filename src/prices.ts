import express, {Application, Request, Response} from 'express'
import mysql from 'mysql2/promise'
import {RowDataPacket} from 'mysql2'

interface Ticket {
    age: number;
    ticketType: string;
    date: string;
}

interface Cost {
    cost: number;
}

type Holidays = Array<{ holiday: Date }>

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

    async function getPrice(getBasePriceFor: () => Promise<Cost>, ticket: Ticket, getHolidays: () => Promise<Holidays>) {
        const result = (await getBasePriceFor())
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
                    return {cost: Math.ceil(result.cost * .7)}
                } else {
                    if (ticket.age === undefined) {
                        const cost = result.cost * (1 - reduction / 100)
                        return {cost: Math.ceil(cost)}
                    } else {
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
                if (ticket.age >= 6) {
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
        const getHolidays = async () => (await connection.query(
            'SELECT * FROM `holidays`'
        ) as RowDataPacket[][] ) [0] as Holidays
        const getBasePriceFor = async () => (await connection.query(
            'SELECT cost FROM `base_price` ' +
            'WHERE `type` = ? ',
            [req.query.type]) as RowDataPacket[][])[0][0] as Promise<Cost>

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
