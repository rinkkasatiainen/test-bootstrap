import {UserRepository} from '../repository/users'
import {PostRepository} from '../repository/posts'

export const newPost:
    (userRepository: UserRepository, postStore: PostRepository) =>
        (userId: string, text: string) => Promise<void> =
    (userRepository, postStore) => async (userId, text) => {
        const user = await userRepository.findUser(userId)
        const post = user.newPost(text)
        await post.save(postStore.store)
    }
