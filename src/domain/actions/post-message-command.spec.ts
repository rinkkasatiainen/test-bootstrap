import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { v4 } from 'uuid'
import {PostMessageCommandHandler, SocialMediaUser, UnstoredMessageEntity} from './post-message-command-handler'

chai.use(sinonChai)

describe('posting messages', () => {
    it('checks that user is authorized')

    it('blocks anonymous user posting')

    it('stores the message', async () => {
        const storeMessageFn = sinon.spy()
        const message = { text: 'Lorem ipsum' }
        const newMessage: UnstoredMessageEntity = {
            id: v4(),
            time: new Date(),
            text: message.text,
        }
        const socialMediaUser: SocialMediaUser = {
            createNewMessage: () => newMessage,
        }

        const commandHandler = new PostMessageCommandHandler(storeMessageFn)
        await commandHandler.execute({ message, user: socialMediaUser })


        expect(storeMessageFn).to.have.been.calledWith(newMessage)
    })

    it('returns the correct id')
})
