import {Server} from 'http'
import request from 'supertest'
import {testServer} from '../test-server'

describe('Express Server', () => {
    describe('just work', () => {
        let app: Server

        before(async () => {
            app = await testServer.start()
        })

        after( () => {
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
})
