import {validate} from 'uuid'
import {Post} from '../entities/post'
import {ReadRepo} from '../repository/posts'

export const getPost: (repository: ReadRepo) => (postId: string) => Promise<Post> =
    repo => async (postId) => {
        if (!validate(postId)) {
            return Promise.reject({message: `Invalid post ID: ${postId}`})
        }
        const post = await repo.read(postId)
        if( post === null) {
            return Promise.reject({status: 404, message: `not found: ${postId}`})
        }
        return post
    }

