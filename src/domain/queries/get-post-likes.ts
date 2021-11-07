import {validate} from 'uuid'
import {ReadRepo} from '../repository/posts'

export const getPostLikes: (repository: ReadRepo) => (postId: string) => Promise<string[]> =
    repo => postId => {
        if (!validate(postId)) {
            return Promise.reject({message: `Invalid post ID: ${postId}`})
        }

        return repo.likes(postId)
    }
