import {Server} from 'http'
import {startServer} from '../src/server'
import {Tweet} from '../src/domain/entities/tweet'
import {Repository} from '../src/domain/repository/tweets'

export interface TestServer {
    start: (r: Repository) => Promise<Server>;
}

const dummyTweet: Tweet = {
    dateTime: '12.03.2021', id: 'some_id', text: 'Today is my BD', userId: 'some_id',
}

export const dummyRepository: Repository = {
    store: async () => Promise.resolve(),
    read: async () => Promise.resolve(dummyTweet),
}

export const testServer: TestServer = {
    start: (repository: Repository) => startServer({PORT: 7878})(repository),
}