export interface Post {
    // id: string;
    // userId: string;
    // text: string;
    // dateTime: string;

    save(store:
        (postId: string,
            text: string,
            userId: string,
            replyTo?: string,
            quote?: string,
            mentions?: string[]) => Promise<void>): Promise<void>;

    setReplyTo(postId: string): void;
}

type StoreFunc = (postId: string, text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[])
    => Promise<void>

export class PostImpl implements Post {
    private replyTo?: string

    public constructor(private readonly text: string, private readonly id: string, private readonly userId: string) {
        this.replyTo = undefined
    }

    public save(store: StoreFunc): Promise<void> {
        return store(this.id, this.text, this.userId, this.replyTo)
    }

    public setReplyTo(postId: string): void {
        this.replyTo = postId
    }
}

