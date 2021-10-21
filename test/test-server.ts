import {Server} from 'http'
import {startServer} from '../src/server'
import {Tweet, TweetImpl} from '../src/domain/entities/tweet'
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

        store: (tweetId, text, userId, replyTo?: string, quote?: string, mentions?: string[]) => {
            const tweet: Tweet = new TweetImpl(text, tweetId, userId)
            tweets[tweetId] = tweet
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
