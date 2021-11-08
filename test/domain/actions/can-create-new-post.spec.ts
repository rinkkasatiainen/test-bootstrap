import chai, {expect} from 'chai'
import sinon, {SinonSpy} from 'sinon'
import sinonChai from 'sinon-chai'
import {v4} from 'uuid'
import {canPostNewMessage, newPost, NewPostCommand, NewPostCommandHandler} from '../../../src/domain/actions/new-post'
import {AuthenticatedUser, User, UserRepository} from '../../../src/domain/repository/users'
import {PostRepository, ReadRepo, WriteRepo} from '../../../src/domain/repository/posts'
import {Post, PostId} from '../../../src/domain/entities/post'
import {Failure, ResultType, Success, successOf} from '../../../src/domain/result'

chai.use(sinonChai)
/* eslint-disable @typescript-eslint/ban-ts-comment */
const mockPostStore: <T extends ReadRepo | WriteRepo>(x: T) => PostRepository = (mockWith) => ({
    // @ts-ignore
    likes: () => {
        throw new Error('should not be called in test')
    },
    // @ts-ignore
    read: (): Promise<Post> => {
        throw new Error('should not be called in test')
    },
    // @ts-ignore
    store: (): Promise<void> => {
        throw new Error('should not be called in test')
    },
    ...mockWith,
})

/* eslint-enable @typescript-eslint/ban-ts-comment */

const mockUserRepo = (x: Post) => ({
    findUser(userId: string): Promise<Success<User>> {
        return Promise.resolve(successOf<User>({
            newPost: () => Promise.resolve(x),
        }))
    },
})

describe('When creating a new post', () => {
    describe('when a user is authenticated', () => {
        let newPostCommandHandler: NewPostCommandHandler
        let users: UserRepository
        let postStore: PostRepository
        let postId: PostId
        let user: User
        // let newPostFn: SinonSpy
        let storeFn: SinonSpy
        const uuidProvider = () => postId.postId
        let authenticatedUser: AuthenticatedUser
        let post: Post

        beforeEach(() => {
            // newPostFn = sinon.spy()
            postId = {postId: v4()}
            storeFn = sinon.spy()
            authenticatedUser = {id: v4()}
            post = {text: 'text', authorId: authenticatedUser, postId }
            // mock repositories
            users = mockUserRepo({createdById: authenticatedUser.id, post})
            postStore = mockPostStore<WriteRepo>({store: storeFn})
            // create command handler
            newPostCommandHandler = newPost(users, postStore, uuidProvider, canPostNewMessage)
        })

        it('1. can create a new post', async () => {
            const command: NewPostCommand = {
                text: 'new post',
                authorId: authenticatedUser,
            }

            await newPostCommandHandler(authenticatedUser, command)

            const post = {...command, postId}
            expect(storeFn).to.have.been.calledWith({createdById: authenticatedUser.id, post})
        })
        it('1.1 returns created post', async () => {
            const command: NewPostCommand = {
                text: 'new post',
                authorId: authenticatedUser,
            }

            const result: Success<PostId> = await newPostCommandHandler(authenticatedUser, command)
            const expected: Success<PostId> = {
                type: ResultType.success,
                data: {postId: uuidProvider()},
            }
            expect(result).to.eql(expected)

        })

        it('2. Cannot post on some other user timeline', async () => {
            const authenticatedUser = {id: v4()}
            const command: NewPostCommand = {
                text: 'new post',
                authorId: {id: v4()},
            }

            const result: Failure = await newPostCommandHandler(authenticatedUser, command)
            expect(result.cause).to.eql(`Unauthorized to post to '${command.authorId.id}'`)
            expect(storeFn).to.not.have.been.called
        })
    })
})

