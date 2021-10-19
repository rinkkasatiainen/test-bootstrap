import {EnvVariables, startServer} from './src/server'
import {Repository} from "./src/domain/repository/tweets";

export {startServer} from './src/server'


const envVars: EnvVariables = {
    PORT: 7777,
}
const repository: Repository = {
    store: () => new Promise(resolve => {
        /* noop */
    }),
}
// eslint-disable-next-line no-console
console.log('start server')

startServer(envVars)(repository)
