import {EnvVariables, startServer} from './src/server'
import {PostRepository} from './src/domain/repository/posts'
import {Post, PostImpl} from './src/domain/entities/post'

export {startServer} from './src/server'


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

export const inMemoryRepository: PostRepository = createRepostitory()

const envVars: EnvVariables = {
    PORT: 7777,
}
// eslint-disable-next-line no-console
console.log('start server')

startServer(envVars)(inMemoryRepository)
