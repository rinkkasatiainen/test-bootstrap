import {validate} from 'uuid'
import {Tweet} from '../entities/tweet'
import {ReadRepo} from '../repository/tweets'

export const getTweet: (repository: ReadRepo) => (tweetId: string) => Promise<Tweet> =
    repo => tweetId => {
        if (!validate(tweetId)) {
            return Promise.reject({message: `Invalid tweet ID: ${tweetId}`})
        }

        return repo.read(tweetId)
    }

