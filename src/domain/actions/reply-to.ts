import {PostRepository} from '../repository/tweets'
import {UserRepository} from '../repository/users'


export const newTweet:
    (userRepository: UserRepository, tweetStore: PostRepository) =>
        (userId: string, text: string) => Promise<void> =
    (userRepository, tweetStore) => async (userId, text) => {
        const user = await userRepository.findUser(userId)
        const tweet = user.newTweet(text)
        // tweet.setMentions( replyToTweet )
        // tweet.setMentions(body.mentions)
        await tweet.save(tweetStore.store)
    }

export const replyTo:
    (userRepository: UserRepository, postStore: PostRepository) =>
        (userId: string, text: string, replyToId: string) => Promise<void> =
    (userRepository, postStore) => async (userId, text, postId) => {
        const user = await userRepository.findUser(userId)
        const tweet = user.newTweet(text)
        const replyToTweet = await postStore.read(postId)
        if( replyToTweet === null) {
            return Promise.reject({status: 404, message: `not found: ${postId}`})
        }
        tweet.setReplyTo(postId)
        // tweet.setMentions( replyToTweet )
        // tweet.setMentions(body.mentions)
        await tweet.save(postStore.store)
    }
