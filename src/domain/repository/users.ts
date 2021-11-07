import {Post, PostImpl} from '../entities/post'

export interface User {
    newPost: (text: string) => Post;
}

export interface UserRepository {
    findUser: (userId: string) => Promise<User>;
}

export class CanSendAPost implements User {
    public constructor(private readonly id: string) {
    }

    public newPost(text: string): Post {
        return new PostImpl(text, 'uuid', this.id)
    }
}
