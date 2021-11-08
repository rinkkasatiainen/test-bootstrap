import {NextFunction, Request, Response, Router} from 'express'
import {PostRepository} from '../domain/repository/posts'
import {getPost} from '../domain/queries/get-post'
import {replyTo} from '../domain/actions/reply-to'
import {UserRepository} from '../domain/repository/users'
import {getPostLikes} from '../domain/queries/get-post-likes'
import {canPostNewMessage, newPost, UuidProvider} from '../domain/actions/new-post'
import {isSuccess, Result} from '../domain/result'

const requireBody = (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body: { text?: string } = req.body || {}
    if (body.text) {
        next()
        return
    }
    res.status(500)
    res.json({
        status: 'missing body',
    })
}

export const routes: (a: Router) => (b: PostRepository) => (c: UserRepository) => (d: UuidProvider) => Router =
    router => postStore => userRepository => uuidProvider => {


        router.get('/', (req: Request, res: Response) => {
            res.json({status: 'ok'})
        })

        router.get('/status/:status', (req: Request, res: Response) => {
            const status = req.params.status
            res.json({status})
        })

        router.get('/post/:postId', (req: Request, res: Response) => {
            const postId = req.params.postId
            void getPost(postStore)(postId)
                .then(post => res.json({post}))
                .catch((error: Error & { status: number }) => {
                    const message: string = error.message || 'unknown error'
                    if (error.status) {
                        res.status(error.status)
                    } else {
                        res.status(500)
                    }
                    res.json({
                        status: message,
                    })
                })
        })

        router.get('/post/:postId/likes', (req: Request, res: Response) => {
            const postId = req.params.postId
            void getPostLikes(postStore)(postId)
                .then(likes => res.json({likes}))
                .catch((error: Error & { status?: number }) => {
                    const message: string = error.message || 'unknown error'
                    if (error.status) {
                        res.status(error.status)
                    } else {
                        res.status(404)
                    }
                    res.json({
                        status: message,
                    })
                })
        })

        router.post('/user/:userId/posts',
            requireBody,
            async (req: Request, res: Response) => {
                const userId = req.params.userId
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const body: { text: string } = req.body
                const result: Result<{ postId: string }> =
                    await newPost(userRepository, postStore, uuidProvider, canPostNewMessage)(
                        {id: userId}, {text: body.text, authorId: {id: userId}},
                    )
                if (isSuccess(result)) {
                    res.status(201)
                    res.header('link', `/user/${userId}/post/${result.data.postId}`)
                    res.json({status: 'created', id: result.data.postId})
                }
            })

        router.post('/post/:postId/reply/:userId',
            requireBody,
            async (req: Request, res: Response) => {
                const {postId, userId} = req.params
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const body: { text: string } = req.body
                await replyTo(userRepository, postStore)(userId, body.text, postId)
                    .then(() => res.json({status: 'uuid'}))
                    .catch((error: Error & { status?: number }) => {
                        const message: string = error.message || 'unknown error'
                        if (error.status) {
                            res.status(error.status)
                        } else {
                            res.status(404)
                        }
                        res.json({
                            status: message,
                        })
                    })
            })

        return router
    }
