import {Server} from 'http'
import {AddressInfo} from 'net'
import express, {Application, Router} from 'express'
import {routes} from './web/routes'

export  type RoutesProvider = (a: Application) => Router;

export interface EnvVariables {
    PORT: number;
}

export interface Repository {
    store: (text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[]) => Promise<void>;
}

const router: Router = Router()

export const startServer: (x: EnvVariables) => (y: Repository) => Promise<Server> =
    envVars => repository => {

        const routesProvider: RoutesProvider = routes(router)(repository)

        const expressApp: Application = express()
        expressApp.use('/', routesProvider(expressApp))

        // TODO AkS: Fix flashes!
        const port = envVars.PORT || 7778
        expressApp.set('port', port)

        return new Promise( (resolve, reject) => {
            const server = expressApp.listen(port, () => {
                // eslint-disable-next-line no-console
                console.log(`Express running → PORT ${(server.address() as AddressInfo).port}`)
                resolve(server)
            })
        })
    }
