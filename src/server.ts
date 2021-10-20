import {Server} from 'http'
import {AddressInfo} from 'net'
import express, {Application, Router} from 'express'

export interface EnvVariables {
    PORT: number;
}


export const startServer: (x: EnvVariables) => Promise<Server> =
    envVars => {
        const router: Router = Router()

        const expressApp: Application = express()
        expressApp.use(router)
        expressApp.use('/', (req, res) => {
            res.json({hello: 'World!'})
        })

        const port = envVars.PORT || 7778
        expressApp.set('port', port)

        return new Promise((resolve) => {
            const server = expressApp.listen(port, () => {
                // eslint-disable-next-line no-console
                console.log(`Express running → PORT ${(server.address() as AddressInfo).port}`)
                resolve(server)
            })
        })
    }


