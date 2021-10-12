import express, {Application, Request, Response} from 'express'
import mysql from 'mysql2/promise'
import {RowDataPacket} from 'mysql2'

export async function createApp() {
    const app: Application = express()

    const connectionOptions = {host: 'localhost', user: 'root', database: 'lift_pass', password: 'mysql'}
    const connection = await mysql.createConnection(connectionOptions)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.put('/prices',  async (req: Request, res: Response) => {
        const liftPassCost = req.query.cost
        const liftPassType = req.query.type
        await connection.query(
            'INSERT INTO `base_price` (type, cost) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE cost = ?',
            [liftPassType, liftPassCost, liftPassCost])

        res.json()
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.get('/prices', async (req: Request, res: Response) => {
        // TODO: AkS: This is a nasty hack.
        const newVar: RowDataPacket[][]  = await connection.query(
            'SELECT cost FROM `base_price` ' +
            'WHERE `type` = ? ',
            [req.query.type]) as RowDataPacket[][]
        const result = newVar[0][0]

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (req.query.age < 6) {
            res.json({cost: 0})
        } else {
            if (req.query.type !== 'night') {
                // TODO: AkS: This is a nasty hack
                const newVar1: RowDataPacket[] = await connection.query(
                    'SELECT * FROM `holidays`'
                ) as RowDataPacket[]
                const holidays = newVar1[0]

                let isHoliday
                let reduction = 0
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                for (const row of holidays) {
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    const holiday = row.holiday
                    if (req.query.date) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const d = new Date(req.query.date)
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
                if (!isHoliday && new Date(req.query.date).getDay() === 1) {
                    reduction = 35
                }

                // TODO apply reduction for others
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (req.query.age < 15) {
                    res.json({cost: Math.ceil(result.cost * .7)})
                } else {
                    if (req.query.age === undefined) {
                        const cost = result.cost * (1 - reduction / 100)
                        res.json({cost: Math.ceil(cost)})
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (req.query.age > 64) {
                            const cost = result.cost * .75 * (1 - reduction / 100)
                            res.json({cost: Math.ceil(cost)})
                        } else {
                            const cost = result.cost * (1 - reduction / 100)
                            res.json({cost: Math.ceil(cost)})
                        }
                    }
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (req.query.age >= 6) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (req.query.age > 64) {
                        res.json({cost: Math.ceil(result.cost * .4)})
                    } else {
                        res.json(result)
                    }
                } else {
                    res.json({cost: 0})
                }
            }
        }
    })
    return {app, connection}
}
