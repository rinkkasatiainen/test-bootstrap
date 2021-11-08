import {Post} from '../entities/post'
import {Result} from '../result'
import {NewPostCommand} from '../actions/new-post'

export interface MightBeAuthenticatedUser {
    id?: string;
}
export interface AuthenticatedUser {
    id: string;
}

export interface User {
    newPost: (cmd: NewPostCommand) => Post;
}

export interface UserRepository {
    findUser: (userId: string) => Promise<Result<User>>;
}

export class CanSendAPost implements User {
    public constructor(private readonly id: string) {
    }

    public newPost(cmd: NewPostCommand): Post {
        return {}
    }
}
