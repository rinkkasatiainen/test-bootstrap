import {Tweet, TweetImpl} from '../entities/tweet'

export interface User {
    newTweet: (text: string) => Tweet;
}

export interface UserRepository {
    findUser: (userId: string) => Promise<User>;
}

export class Tweeter implements User {
    public constructor(private readonly id: string) {
    }

    public newTweet(text: string): Tweet {
        return new TweetImpl(text, 'tweet-id', this.id)
    }
}
