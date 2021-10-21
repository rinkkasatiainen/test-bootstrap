import {Server} from 'http'
import {AddressInfo} from 'net'
import express, {Application, Router} from 'express'
import bodyParser from 'body-parser'
import {routes} from './web/routes'
import {Repository} from './domain/repository/tweets'

export interface EnvVariables {
    PORT: number;
}


export const startServer: (x: EnvVariables) => (y: Repository) => Promise<Server> =
    envVars => repository => {
        const router: Router = Router()

        const expressApp: Application = express()
        expressApp.use(bodyParser.json())

        expressApp.use('/', routes(router)(repository))


        // TODO AkS: Fix flashes!
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
