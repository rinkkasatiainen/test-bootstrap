import {PostRepository} from '../repository/posts'
import {UserRepository} from '../repository/users'
import {isSuccess} from '../result'


type ReplyToCommandHandler = (userId: string, text: string, replyToId: string) => Promise<void>
export const replyTo:
    (userRepository: UserRepository, postStore: PostRepository) =>
        ReplyToCommandHandler =
    (userRepository, postStore) => async (userId, text, postId) => {
        const userResult = await userRepository.findUser(userId)
        if (isSuccess(userResult)) {
            const user = userResult.data
            const post = user.newPost({text, authorId: {id: userId}})
            const replyToMsg = await postStore.read(postId)
            if (replyToMsg === null) {
                return Promise.reject({status: 404, message: `not found: ${postId}`})
            }
            // post.setReplyTo(postId)
            // post.setMentions( replyTo )
            // post.setMentions(body.mentions)
            // await post.save(postStore.store)
        }
    }
