import express, {Application, Request, Response} from 'express'
import mysql from 'mysql2/promise'
import {RowDataPacket} from 'mysql2'
import {calculatePrice, Cost, Holidays, Ticket} from "./pricing";

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


        const price = await calculatePrice(getBasePriceFor, ticket, getHolidays)
        res.json(price)
    })
    return {app, connection}
}
