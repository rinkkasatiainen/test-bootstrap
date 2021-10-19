import {EnvVariables, Repository, startServer} from './src/server'

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
