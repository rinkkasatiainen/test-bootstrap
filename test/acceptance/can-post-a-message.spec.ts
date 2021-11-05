import { expect } from 'chai'
import { v4 } from 'uuid'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Query {
}


interface QueryHandler<Q extends Query, R> {
    execute: (query: Q) => R;
}

interface GetMessageQuery {
    userId: string;
}

interface SentMessage {
    text: string;
}

interface Message {
    time: string;
    text: string;
}

interface Timelime {
    messages: Message[];
}

class GetMessageQueryHandler implements QueryHandler<GetMessageQuery, Timelime> {
    public execute(query: GetMessageQuery): Timelime {
        return { messages: [] }
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Command {
}

interface CommandHandler<T extends Command, R> {
    execute: (message: T) => R;
}

interface PostMessageCommand {
    userId: string;
    message: SentMessage;
}

class PostMessageCommandHandler implements CommandHandler<PostMessageCommand, string> {
    public execute(message: PostMessageCommand): string {
        return ''
    }
}

describe('Alice can publish messages to a personal timeline', () => {
    it('messages can be read by unauthenticated user', () => {
        const aliceUserId: string = v4().toString()
        const firstMessageSentByAlice: SentMessage = { text: 'Hello World!' }
        // Alice posts a message

        const postMessageCommandHandler: PostMessageCommandHandler = new PostMessageCommandHandler()
        postMessageCommandHandler.execute({ userId: aliceUserId, message: firstMessageSentByAlice })

        // Verify that anyone can read the message
        const getMessagesQueryHandler: GetMessageQueryHandler = new GetMessageQueryHandler()
        const alicePublicTimeline = getMessagesQueryHandler.execute({ userId: aliceUserId })
        expect(alicePublicTimeline).to.eql({ messages: [{ time: 'now', ...firstMessageSentByAlice }] })
    })
})
