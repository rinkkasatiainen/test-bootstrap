import {Post, PostId} from '../entities/post'
import {AuthenticatedUser} from './users'

export interface NewPost {
    createdById: string;
    post: {
        text: string;
        authorId: AuthenticatedUser;
        postId: PostId;
    };
}

export interface WriteRepo {
    store: (
        x: NewPost,
    ) => Promise<void>;
}

export interface ReadRepo {
    read: (id: string) => Promise<Post | null>;
    likes: (id: string) => Promise<string[]>;
}

export type PostRepository = ReadRepo & WriteRepo
