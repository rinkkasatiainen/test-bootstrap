import {Server} from 'http'
import {startServer} from '../src/server'
import {Post, PostImpl} from '../src/domain/entities/post'
import {PostRepository} from '../src/domain/repository/tweets'

export interface TestServer {
    start: (r: PostRepository) => Promise<Server>;
    on: (port: number) => { start: (r: PostRepository) => Promise<Server> };
}

const createRepostitory: () => PostRepository = () => {
    const tweets: Record<string, Post> = {}

    const newVar: PostRepository = {
        likes(id: string): Promise<string[]> {
            return Promise.resolve([])
        }, read(id: string): Promise<Post | null> {
            if (tweets[id]) {
                return Promise.resolve(tweets[id])
            }
            return Promise.resolve(null)
        },

        store: (tweetId, text, userId, replyTo?: string, quote?: string, mentions?: string[]) => {
            const tweet: Post = new PostImpl(text, tweetId, userId)
            tweets[tweetId] = tweet
            return Promise.resolve()
        },
    }
    return newVar

}

export const dummyRepository: PostRepository = createRepostitory()

export const testServer: TestServer = {
    start: async (repository: PostRepository) => await startServer({PORT: 7878})(repository),
    on: (port) => ({
        start: async (repository: PostRepository) => await startServer({PORT: port})(repository),
    }),
}
