import {Server} from 'http'
import request from 'supertest'
import {v4} from 'uuid'
import sinon, {SinonStub} from 'sinon'
import chai, {expect} from 'chai'
import sinonChai from 'sinon-chai'
import {dummyRepository, testServer} from '../test-server'
import {Post, PostImpl} from '../../src/domain/entities/post'
import {ReadRepo, PostRepository, WriteRepo} from '../../src/domain/repository/posts'

chai.use(sinonChai)

const mockWriteRepoWith: (x: WriteRepo | ReadRepo) => PostRepository =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    mockWith => ({
        ...dummyRepository,
        ...mockWith,
    })


const mockReadRepoWith: (x: ReadRepo) => PostRepository =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    mockWith => ({
        store: () => Promise.resolve(),
        // ...dummyRepository,
        ...mockWith,
    })

const likes = [v4().toString(), v4().toString()]
const idInRepository = v4().toString()
const post = new PostImpl('Some text', idInRepository, 'user-id')

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

    describe('getting Posts', () => {
        let appServer: Server
        let fakeRepository: ReadRepo & WriteRepo

        before(async () => {
            fakeRepository = mockReadRepoWith({
                read(id: string): Promise<Post | null> {
                    if (id === idInRepository) {
                        return Promise.resolve(post)
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

        it('can get post', (done) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const {text, id, userId} = post
            const expected = {text, id, userId}
            void request(appServer)
                .get(`/post/${idInRepository}`)
                .expect({post: expected})
                .expect(200, done)
        })

        it('post id needs to be UUID', (done) => {
            const invalidId = 'some-random-id'
            void request(appServer)
                .get(`/post/${invalidId}`)
                .expect({status: `Invalid post ID: ${invalidId}`})
                .expect(500, done)
        })

        it('can get likes for a post', (done) => {
            void request(appServer)
                .get(`/post/${idInRepository}/likes`)
                .expect({likes})
                .expect(200, done)
        })

        it('return NOT FOUND, if post not found', (done) => {
            const notFoundId = v4().toString()
            void request(appServer)
                .get(`/post/${notFoundId}`)
                .expect({status: `not found: ${notFoundId}`})
                .expect(404, done)
        })
    })

    describe('posting posts', () => {
        let appServer: Server
        let fakeRepository: PostRepository
        let storeStub: SinonStub

        before(async () => {
            storeStub = sinon.stub()
            fakeRepository = mockWriteRepoWith({
                store: storeStub,
                read(id: string): Promise<Post | null> {
                    if (id === idInRepository) {
                        return Promise.resolve(post)
                    }
                    return Promise.resolve(null)
                },
            })
            appServer = await testServer.start(fakeRepository)
        })

        afterEach(() => {
            storeStub.reset()
        })

        after((done) => {
            appServer.close(() => {
                // eslint-disable-next-line no-console
                console.log('Http server closed.')
                done()
            })
        })

        it('returns post id', async () => {
            await request(appServer)
                .post('/user/some-user-id/tweets')
                .send({text: 'some text'})
                .expect(200)
                .expect({status: 'uuid'})
            expect(storeStub).to.have.been.calledWith('uuid', 'some text', 'some-user-id')
        })

        it('requires body', async () => {
            await request(appServer)
                .post('/user/some-user-id/tweets')
                .expect(500)
                .expect({status: 'missing body'})
        })

        describe('can reply to', () => {
            it('stores it in DB', async () => {
                const userId = 'some-user-id'
                await request(appServer)
                    .post(`/post/${idInRepository}/reply/${userId}`)
                    .send({text: 'some reply'})
                    .expect(200)
                    .expect({status: 'uuid'})
                expect(storeStub).to.have.been.calledWith('uuid', 'some reply', userId, idInRepository)
            })
            it('only on valid post id', async () => {
                const userId = 'some-user-id'
                const nonExistingId = v4().toString()
                await request(appServer)
                    .post(`/post/${nonExistingId}/reply/${userId}`)
                    .send({text: 'some reply'})
                    .expect(404)
                    .expect({status: `not found: ${nonExistingId}`})
                expect(storeStub).to.not.have.been.called
            })
        })
    })
})
