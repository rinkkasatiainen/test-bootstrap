import {Server} from 'http'
import {Repository, startServer} from '../src/server'

export interface TestServer{
    start: () => Promise<Server>;
}

const repository: Repository = {
    store: () => new Promise(resolve => { /* noop*/ }),
}
export const testServer: TestServer = {
    start: () => startServer({PORT: 7878})(repository),
}
