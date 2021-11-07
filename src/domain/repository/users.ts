import {Post, PostImpl} from '../entities/post'

export interface User {
    newTweet: (text: string) => Post;
}

export interface UserRepository {
    findUser: (userId: string) => Promise<User>;
}

export class Tweeter implements User {
    public constructor(private readonly id: string) {
    }

    public newTweet(text: string): Post {
        return new PostImpl(text, 'uuid', this.id)
    }
}
