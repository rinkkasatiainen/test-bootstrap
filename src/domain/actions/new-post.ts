import {AuthenticatedUser, MightBeAuthenticatedUser, User, UserRepository} from '../repository/users'
import {PostRepository, NewPost} from '../repository/posts'
import {Failure, failureOf, isFailure, Result, ResultType, Success, successOf} from '../result'
import {PostId} from '../entities/post'

export interface NewPostCommand {
    text: string;
    authorId: AuthenticatedUser;
}

export type NewPostCommandHandler = (userId: MightBeAuthenticatedUser, x: NewPostCommand) => Promise<Result<PostId>>
export type UuidProvider = () => string

interface ValidateNewPostCommand {
    validate: (a: MightBeAuthenticatedUser, b: NewPostCommand) => Result<NewPostCommand>;
}

export const canPostNewMessage: ValidateNewPostCommand = {
    validate: (mightBeAuthenticated, cmd) =>
        mightBeAuthenticated.id === cmd.authorId.id ?
            successOf(cmd) :
            failureOf(`Unauthorized to post to '${cmd.authorId.id}'`),
}

export const newPost2: (
    userRepository: UserRepository,
    postStore: PostRepository,
    uuidProvider: UuidProvider,
    validator: ValidateNewPostCommand,
) => NewPostCommandHandler =
    (userRepository, postStore, uuidProvider, validator) =>
        async (authenticatedUser, cmd) => {
            // validate
            if (authenticatedUser.id !== cmd.authorId.id) {
                const err: Failure = {cause: `Unauthorized to post to '${cmd.authorId.id}'`, type: ResultType.failure}
                return Promise.resolve(err)
            }

            // create new post
            const postId: string = uuidProvider()
            const post = {...cmd, postId: {postId}}
            const newPostImpl: NewPost = {createdById: post.authorId.id, post}

            // store post to DB (or such)
            await postStore.store(newPostImpl)

            // return
            return Promise.resolve({type: ResultType.success, data: {postId}})
        }


export const newPost: (
    userRepository: UserRepository,
    postStore: PostRepository,
    uuidProvider: UuidProvider,
    validator: ValidateNewPostCommand,
) => NewPostCommandHandler =
    (userRepository, postStore, uuidProvider, validator) =>
        async (authenticatedUser, cmd) => {
            // validate
            const res = validator.validate(authenticatedUser, cmd)
            if (isFailure(res)) {
                return Promise.resolve(res)
            }


            // create new post
            const res2 = await userRepository.findUser(cmd.authorId.id)
            if (isFailure(res)) {
                return Promise.resolve(res)
            } else {
                const user = (res2 as Success<User>).data
                user.newPost(cmd)
            }

            const postId: string = uuidProvider()
            const post = {...cmd, postId: {postId}}
            const newPostImpl: NewPost = {createdById: post.authorId.id, post}

            // store post to DB (or such)
            await postStore.store(newPostImpl)

            // return
            return Promise.resolve({type: ResultType.success, data: {postId}})
        }
