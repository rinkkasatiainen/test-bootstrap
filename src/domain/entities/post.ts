export interface Post {
    // id: string;
    // userId: string;
    // text: string;
    // dateTime: string;

    save(store:
             (tweetId: string,
              text: string,
              userId: string,
              replyTo?: string,
              quote?: string,
              mentions?: string[]) => Promise<void>): Promise<void>;

    setReplyTo(tweetId: string): void;
}

type StoreFunc = (tweetId: string, text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[]) => Promise<void>

export class PostImpl implements Post {
    private replyTo?: string;

    public constructor(private readonly text: string, private readonly id: string, private readonly userId: string) {
        this.replyTo = undefined
    }

    public save(store: StoreFunc): Promise<void> {
        return store(this.id, this.text, this.userId, this.replyTo)
    }

    public setReplyTo(tweetId: string): void {
        this.replyTo = tweetId
    }
}

