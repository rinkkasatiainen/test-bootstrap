// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Command {
}

interface CommandHandler<T extends Command, R> {
    execute: (message: T) => Promise <R>;
}

export interface SocialMediaUser {
    createNewMessage: (m: SentMessage) => UnstoredMessageEntity;
}

export interface SentMessage {
    // TODO: this is probably a domain value object
    text: string;
}

interface PostMessageCommand {
    user: SocialMediaUser;
    message: SentMessage;
}

export interface UnstoredMessageEntity {
}

export type StoreMessage = (a: UnstoredMessageEntity) => Promise <void>

export class PostMessageCommandHandler implements CommandHandler<PostMessageCommand, string> {

    public constructor(private readonly storeMessage: StoreMessage) {

    }

    public async execute(cmd: PostMessageCommand): Promise <string> {
        // 1. validate that Command is valid
        // 2. Execute Command
        // create messageEntity
        // store entity to repository
        await this.storeMessage(cmd.user.createNewMessage(cmd.message))
        // 3. return a Result
        return ''
    }
}
