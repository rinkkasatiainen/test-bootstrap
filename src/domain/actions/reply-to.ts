import {Repository} from '../repository/tweets'
import {UserRepository} from '../repository/users'


export const newTweet:
    (userRepository: UserRepository, tweetStore: Repository) =>
        (userId: string, text: string) => Promise<void> =
    (userRepository, tweetStore) => async (userId, text) => {
        const user = await userRepository.findUser(userId)
        const tweet = user.newTweet(text)
        // tweet.setMentions( replyToTweet )
        // tweet.setMentions(body.mentions)
        await tweet.save(tweetStore.store)
    }

export const replyTo:
    (userRepository: UserRepository, tweerRepository: Repository) =>
        (userId: string, text: string, replyToId: string) => Promise<void> =
    (userRepository, tweetStore) => async (userId, text, tweetId) => {
        const user = await userRepository.findUser(userId)
        const tweet = user.newTweet(text)
        // const replyToTweet = await tweetStore.read(tweetId)
        tweet.setReplyTo(tweetId)
        // tweet.setMentions( replyToTweet )
        // tweet.setMentions(body.mentions)
        await tweet.save(tweetStore.store)
    }
