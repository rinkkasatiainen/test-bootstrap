import {Router, Request, Response, NextFunction} from 'express'
import {Repository} from '../domain/repository/tweets'
import {getTweet, getTweetLikes} from '../domain/actions/get-tweet'
import {Tweet, TweetImpl} from '../domain/entities/tweet'

interface User {
    newTweet: (text: string) => Tweet;
}

interface UserRepository {
    findUser: (userId: string) => User;
}

class Tweeter implements User {
    public constructor(private readonly id: string) {
    }

    public newTweet(text: string): Tweet {
        return new TweetImpl(text, 'tweet-id', this.id)
    }
}

class InMemoryUserRepository implements UserRepository {
    public findUser(userId: string): User {
        return new Tweeter(userId)
    }
}

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
            void getTweetLikes(repository)(tweetId)
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
            (req: Request, res: Response, next: NextFunction) => {
                if (req.body) {
                    next()
                    return
                }
                res.status(500)
                res.json({
                    status: 'missing body',
                })
            },
            (req: Request, res: Response) => {
                const userId = req.params.userId
                const body: { text: string } = req.body || {text: 'foo'}
                const userRepository = new InMemoryUserRepository()
                const user = userRepository.findUser(userId)
                const tweet = user.newTweet(body.text)
                // tweet.setMentions(body.mentions)
                tweet.save(repository.store)
                res.json({status: 'uuid'})
            })

        return router
    }
