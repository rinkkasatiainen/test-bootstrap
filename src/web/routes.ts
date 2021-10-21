import {NextFunction, Request, Response, Router} from 'express'
import {Repository} from '../domain/repository/tweets'
import {getTweet, getTweetLikes} from '../domain/actions/get-tweet'
import {newTweet, replyTo} from '../domain/actions/reply-to'
import {UserRepository} from '../domain/repository/users'

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

export const routes: (a: Router) => (b: Repository) => (c: UserRepository) => Router =
    router => tweetStore => userRepository => {


        router.get('/', (req: Request, res: Response) => {
            res.json({status: 'ok'})
        })

        router.get('/status/:status', (req: Request, res: Response) => {
            const status = req.params.status
            res.json({status})
        })

        router.get('/tweet/:tweetId', (req: Request, res: Response) => {
            const tweetId = req.params.tweetId
            void getTweet(tweetStore)(tweetId)
                .then(tweet => res.json({tweet}))
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

        router.get('/tweet/:tweetId/likes', (req: Request, res: Response) => {
            const tweetId = req.params.tweetId
            void getTweetLikes(tweetStore)(tweetId)
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

        router.post('/user/:userId/tweets',
            requireBody,
            async (req: Request, res: Response) => {
                const userId = req.params.userId
                const body: { text: string } = req.body
                await newTweet(userRepository, tweetStore)(userId, body.text)
                res.json({status: 'uuid'})
            })

        router.post('/tweet/:tweetId/reply/:userId',
            requireBody,
            async (req: Request, res: Response) => {
                const {tweetId, userId} = req.params
                const body: { text: string } = req.body
                void replyTo(userRepository, tweetStore)(userId, body.text, tweetId)
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
