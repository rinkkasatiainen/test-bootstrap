import {Server} from 'http'
import {startServer} from '../src/server'
import {Tweet} from '../src/domain/entities/tweet'
import {Repository} from '../src/domain/repository/tweets'

export interface TestServer {
    start: (r: Repository) => Promise<Server>;
    on: (port: number) => { start: (r: Repository) => Promise<Server> };
}

const createRepostitory: () => Repository = () => {
    const tweets: Record<string, Tweet> = {}

    const newVar: Repository = {
        likes(id: string): Promise<string[]> {
            return Promise.resolve([])
        }, read(id: string): Promise<Tweet | null> {
            if (tweets[id]) {
                return Promise.resolve(tweets[id])
            }
            return Promise.resolve(null)
        },

        store: (text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[]) => {
            const t: Tweet = {dateTime: 'now', id: 'define', text, userId}
            tweets[t.id] = t
            return Promise.resolve()
        },
    }
    return newVar

}

export const dummyRepository: Repository = createRepostitory()

export const testServer: TestServer = {
    start: async (repository: Repository) => await startServer({PORT: 7878})(repository),
    on: (port) => ({
        start: async (repository: Repository) => await startServer({PORT: port})(repository),
    }),
}
