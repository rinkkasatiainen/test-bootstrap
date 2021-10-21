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
}

type StoreFunc = (text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[]) => Promise<void>

export class TweetImpl implements Tweet {
    private readonly dateTime: string;

    public constructor(private readonly text: string, private readonly id: string, private readonly userId: string) {
        this.dateTime = 'now'
    }

    public save(store: StoreFunc): Promise<void> {
        return store(this.text, this.userId)
    }
}

