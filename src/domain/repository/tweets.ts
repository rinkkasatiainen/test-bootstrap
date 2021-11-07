import {Post} from '../entities/post'

export interface WriteRepo {
    store: (
        tweetId: string,
        text: string,
        userId: string,
        replyTo?: string,
        quote?: string,
        mentions?: string[]) => Promise<void>;
}

export interface ReadRepo {
    read: (id: string) => Promise<Post | null>;
    likes: (id: string) => Promise<string[]>;
}

export type PostRepository = ReadRepo & WriteRepo
