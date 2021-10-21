import {EnvVariables, startServer} from './src/server'
import {Repository} from './src/domain/repository/tweets'
import {Tweet} from './src/domain/entities/tweet'

export {startServer} from './src/server'


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

export const inMemoryRepository: Repository = createRepostitory()

const envVars: EnvVariables = {
    PORT: 7777,
}
// eslint-disable-next-line no-console
console.log('start server')

startServer(envVars)(inMemoryRepository)
