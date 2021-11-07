import {PostRepository} from '../repository/posts'
import {UserRepository} from '../repository/users'


export const replyTo:
    (userRepository: UserRepository, postStore: PostRepository) =>
        (userId: string, text: string, replyToId: string) => Promise<void> =
    (userRepository, postStore) => async (userId, text, postId) => {
        const user = await userRepository.findUser(userId)
        const post = user.newPost(text)
        const replyTo = await postStore.read(postId)
        if( replyTo === null) {
            return Promise.reject({status: 404, message: `not found: ${postId}`})
        }
        post.setReplyTo(postId)
        // post.setMentions( replyTo )
        // post.setMentions(body.mentions)
        await post.save(postStore.store)
    }
