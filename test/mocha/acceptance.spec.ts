import {Server} from 'http'
import request from 'supertest'
import {v4} from 'uuid'
import {dummyRepository, testServer} from '../test-server'
import {Tweet} from '../../src/domain/entities/tweet'
import {ReadRepo, Repository} from '../../src/domain/repository/tweets'

const mockReadRepoWith: (x: ReadRepo) => Repository =
    mockWith => ({
        ...dummyRepository,
        ...mockWith,
    })

describe('Express Server', () => {
    describe('just work', () => {
        let app: Server

        before(async () => {
            app = await testServer.start(dummyRepository)
        })

        after(() => {
            app.close(() => {
                // eslint-disable-next-line no-console
                console.log('Http server closed.')
            })
        })

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
        let app: Server
        let tweet: Tweet
        let fakeRepo: Repository

        before(async () => {
            tweet = {
                dateTime: '19.10.2021 10:13', id: v4().toString(), text: 'Some text', userId: 'user-id',
            }
            fakeRepo = mockReadRepoWith({
                read(): Promise<Tweet> {
                    return Promise.resolve(tweet)
                }
                ,
            })

            app = await testServer.start(fakeRepo)
        })

        after(() => {
            app.close(() => {
                // eslint-disable-next-line no-console
                console.log('Http server closed.')
            })
        })

        it('can get tweet', (done) => {
            void request(app)
                .get(`/tweet/${tweet.id}`)
                .expect({tweet})
                .expect(200, done)
        })

        it('tweet id needs to be UUID', (done) => {
            tweet.id = 'some-random-id'
            void request(app)
                .get(`/tweet/${tweet.id}`)
                .expect({status: `Invalid tweet ID: ${tweet.id}`})
                .expect(500, done)
        })
    })
})
