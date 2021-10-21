export interface Tweet {
    // id: string;
    // userId: string;
    // text: string;
    // dateTime: string;

    save(store:
             (text: string,
              userId: string,
              replyTo?: string,
              quote?: string,
              mentions?: string[]) => Promise<void>): void;

    setReplyTo(tweetId: string): void;
}

type StoreFunc = (text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[]) => Promise<void>

export class TweetImpl implements Tweet {
    private readonly dateTime: string;
    private replyTo?: string;

    public constructor(private readonly text: string, private readonly id: string, private readonly userId: string) {
        this.dateTime = 'now'
        this.replyTo = undefined
    }

    public save(store: StoreFunc): Promise<void> {
        return store(this.text, this.userId, this.replyTo)
    }

    setReplyTo(tweetId: string): void {
        this.replyTo = tweetId
    }
}

