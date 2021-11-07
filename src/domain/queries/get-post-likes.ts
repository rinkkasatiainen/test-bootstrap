import {ReadRepo} from '../repository/posts'
import {validate} from 'uuid'

export const getPostLikes: (repository: ReadRepo) => (postId: string) => Promise<string[]> =
    repo => postId => {
        if (!validate(postId)) {
            return Promise.reject({message: `Invalid post ID: ${postId}`})
        }

        return repo.likes(postId)
    }
