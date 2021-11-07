import {validate} from 'uuid'
import {Post} from '../entities/post'
import {ReadRepo} from '../repository/tweets'

export const getTweet: (repository: ReadRepo) => (tweetId: string) => Promise<Post> =
    repo => async (tweetId) => {
        if (!validate(tweetId)) {
            return Promise.reject({message: `Invalid post ID: ${tweetId}`})
        }
        const tweet = await repo.read(tweetId)
        if( tweet === null) {
            return Promise.reject({status: 404, message: `not found: ${tweetId}`})
        }
        return tweet
    }

export const getTweetLikes: (repository: ReadRepo) => (tweetId: string) => Promise<string[]> =
    repo => tweetId => {
        if (!validate(tweetId)) {
            return Promise.reject({message: `Invalid post ID: ${tweetId}`})
        }

        return repo.likes(tweetId)
    }
