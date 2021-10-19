import {Router, Request, Response} from 'express'
import {Repository} from '../domain/repository/tweets'
import {getTweet} from '../domain/actions/get-tweet'

export const routes: (a: Router) => (b: Repository) => Router =
    router => repository => {

        router.get('/', (req: Request, res: Response) => {
            res.json({status: 'ok'})
        })

        router.get('/status/:status', (req: Request, res: Response) => {
            const status = req.params.status
            res.json({status})
        })

        router.get('/tweet/:tweetId', (req: Request, res: Response) => {
            const tweetId = req.params.tweetId
            void getTweet(repository)(tweetId)
                .then(tweet => res.json({tweet}))
                .catch((error: Error) => {
                    const message: string = error.message || 'unknown error'
                    res.status(500)
                    res.json({
                        status: message,
                    })
                })
        })
        return router
    }
