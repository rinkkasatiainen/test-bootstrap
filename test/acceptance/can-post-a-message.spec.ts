import {expect} from 'chai'
import {
    PostMessageCommandHandler,
    SentMessage, SocialMediaUser,
    StoreMessage,
} from '../../src/domain/actions/post-message-command-handler'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Query {
}

interface QueryHandler<Q extends Query, R> {
    execute: (query: Q) => R;
}

interface GetMessageQuery {
    userId: string;
}

interface Message {
    time: string;
    text: string;
}

interface Timeline {
    messages: Message[];
}

class GetMessageQueryHandler implements QueryHandler<GetMessageQuery, Timeline> {
    public execute(query: GetMessageQuery): Timeline {
        return { messages: [] }
    }
}

const storeMessage: StoreMessage = () => Promise.resolve()

describe('Alice can publish messages to a personal timeline', () => {
    it('messages can be read by unauthenticated user', async () => {
        const alice: SocialMediaUser = {
            createNewMessage: () => ({}),
        }
        const firstMessageSentByAlice: SentMessage = { text: 'Hello World!' }
        // Alice posts a message

        const postMessageCommandHandler: PostMessageCommandHandler = new PostMessageCommandHandler(storeMessage)
        await postMessageCommandHandler.execute({ user: alice, message: firstMessageSentByAlice })

        // Verify that anyone can read the message
        const getMessagesQueryHandler: GetMessageQueryHandler = new GetMessageQueryHandler()
        const alicePublicTimeline = getMessagesQueryHandler.execute({ userId: 'foo' })
        expect(alicePublicTimeline).to.eql({ messages: [{ time: 'now', ...firstMessageSentByAlice }] })
    })
})
