import {Tweet} from '../entities/tweet'

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
    read: (id: string) => Promise<Tweet | null>;
    likes: (id: string) => Promise<string[]>;
}

export type Repository = ReadRepo & WriteRepo
