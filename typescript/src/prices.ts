import express from 'express'
import mysql, {Connection} from 'mysql2/promise'

interface BasePrice {
    cost: number;
}

interface Holiday {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
}

type GetBasePrice = (liftPassType: string) => Promise<BasePrice>
type GetHolidays = () => Promise<Array<{holiday: Holiday}>>

const getBasePrice: (conn: Connection) => GetBasePrice =
    // @ts-ignore
    conn => async (liftPassType: string) => ((await conn.query(
        'SELECT cost FROM `base_price` ' +
        'WHERE `type` = ? ',
        [liftPassType]))[0][0] as unknown as BasePrice)


const getHolidays: (conn: Connection) => GetHolidays =
    // @ts-ignore
    conn => async () => (await conn.query(
        'SELECT * FROM `holidays`'
    ))[0] as mysql.RowDataPacket[]

async function createApp() {
    const app = express()

    const connectionOptions = {host: 'localhost', user: 'root', database: 'lift_pass', password: 'mysql'}
    const connection = await mysql.createConnection(connectionOptions)

    // These look a lot like repositories
    const basePriceFor = getBasePrice(connection)
    const listHolidays = getHolidays(connection)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.put('/prices', async (req, res) => {
        const liftPassCost = req.query.cost
        const liftPassType = req.query.type
        await connection.query(
            'INSERT INTO `base_price` (type, cost) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE cost = ?',
            [liftPassType, liftPassCost, liftPassCost])

        res.json()
    })


    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.get('/prices', async (req, res) => {
        // TODO: precondition check to see all data is given in the request.
        // @ts-ignore
        const liftPassType: string = req.query.type

        if (req.query.age as unknown as number < 6) {
            res.json({cost: 0})
        } else {
            const result: BasePrice = await basePriceFor(liftPassType)

            if (liftPassType !== 'night') {
                const holidays = await listHolidays()

                let isHoliday
                let reduction = 0
                for (const row of holidays) {
                    // eslint-disable-next-line max-len
                    const holiday = row.holiday as unknown as Holiday
                    if (req.query.date) {
                        const d = new Date(req.query.date as string)
                        if (d.getFullYear() === holiday.getFullYear()
                            && d.getMonth() === holiday.getMonth()
                            && d.getDate() === holiday.getDate()) {
                            isHoliday = true
                        }
                    }
                }
                if (!isHoliday && new Date(req.query.date as string).getDay() === 1) {
                    reduction = 35
                }
                if (req.query.age as unknown as number < 15) {
                    res.json({cost: Math.ceil(result.cost * .7)})
                } else {
                    if (req.query.age === undefined) {
                        const cost = result.cost * (1 - reduction / 100)
                        res.json({cost: Math.ceil(cost)})
                    } else {
                        if (req.query.age as unknown as number > 64) {
                            const cost = result.cost * .75 * (1 - reduction / 100)
                            res.json({cost: Math.ceil(cost)})
                        } else {
                            const cost = result.cost * (1 - reduction / 100)
                            res.json({cost: Math.ceil(cost)})
                        }
                    }
                }
            } else {
                if (req.query.age as unknown as number >= 6) {
                    if (req.query.age as unknown as number > 64) {
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

export {createApp}
