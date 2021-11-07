import {Server} from 'http'
import {AddressInfo} from 'net'
import express, {Application, Router} from 'express'
import bodyParser from 'body-parser'
import {routes} from './web/routes'
import {PostRepository} from './domain/repository/posts'
import {CanSendAPost, User, UserRepository} from "./domain/repository/users";

export interface EnvVariables {
    PORT: number;
}

class InMemoryUserRepository implements UserRepository {
    public findUser(userId: string): Promise<User> {
        return Promise.resolve(new CanSendAPost(userId))
    }
}
export const startServer: (x: EnvVariables) => (y: PostRepository) => Promise<Server> =
    envVars => repository => {
        const router: Router = Router()

        const expressApp: Application = express()
        expressApp.use(bodyParser.json())

        expressApp.use('/', routes(router)(repository)(new InMemoryUserRepository()))


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
