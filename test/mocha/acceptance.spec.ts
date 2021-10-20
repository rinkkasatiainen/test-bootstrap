import {Server} from 'http'
import request from 'supertest'
import {v4} from 'uuid'
import {dummyRepository, testServer} from '../test-server'
import {Tweet} from '../../src/domain/entities/tweet'
import {ReadRepo, Repository, WriteRepo} from '../../src/domain/repository/tweets'

const mockReadRepoWith: (x: ReadRepo) => Repository =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    mockWith => ({
        store: () => Promise.resolve(),
        // ...dummyRepository,
        ...mockWith,
    })

const likes = [v4().toString(), v4().toString()]
const tweetIdInRepository = v4().toString()
const tweet = {
    dateTime: '19.10.2021 10:13', id: tweetIdInRepository, text: 'Some text', userId: 'user-id',
}

describe('Express Server', () => {
    describe('just work', () => {
        let app: Server

        before('start test server', async () => {
            app = await testServer.start(dummyRepository)
        })

        after('stop test server', () => new Promise(resolve => {
            app.close(() => {
                // eslint-disable-next-line no-console
                console.log('Http server closed.')
                resolve()
            })
        }))

        it('run the server', (done) => {
            void request(app)
                .get('/')
                .expect(200, done)
        })

        it('can get status', (done) => {
            void request(app)
                .get('/status/foo')
                .expect({status: 'foo'})
                .expect(200, done)
        })
    })

    describe('getting Tweets', () => {
        let appServer: Server
        let fakeRepository: ReadRepo & WriteRepo

        before(async () => {
            fakeRepository = mockReadRepoWith({
                read(id: string): Promise<Tweet | null> {
                    if (id === tweetIdInRepository) {
                        return Promise.resolve(tweet)
                    }
                    return Promise.resolve(null)
                },
                likes(): Promise<string[]> {
                    return Promise.resolve(likes)
                },
            })
            appServer = await testServer.start(fakeRepository)
        })

        after((done) => {
            appServer.close(() => {
                // eslint-disable-next-line no-console
                console.log('Http server closed.')
                done()
            })
        })

        it('can get tweet', (done) => {
            void request(appServer)
                .get(`/tweet/${tweet.id}`)
                .expect({tweet})
                .expect(200, done)
        })

        it('tweet id needs to be UUID', (done) => {
            const invalidTweetId = 'some-random-id'
            void request(appServer)
                .get(`/tweet/${invalidTweetId}`)
                .expect({status: `Invalid tweet ID: ${invalidTweetId}`})
                .expect(500, done)
        })

        it('can get likes for a tweet', (done) => {
            void request(appServer)
                .get(`/tweet/${tweet.id}/likes`)
                .expect({likes})
                .expect(200, done)
        })

        it('return NOT FOUND, if tweet not found', (done) => {
            const notFoundId = v4().toString()
            void request(appServer)
                .get(`/tweet/${notFoundId}`)
                .expect({status: `not found: ${notFoundId}`})
                .expect(404, done)
        })
    })
})
