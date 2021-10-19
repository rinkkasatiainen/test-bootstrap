import {Tweet} from '../entities/tweet'

export interface WriteRepo {
    store: (text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[]) => Promise<void>;
}

export interface ReadRepo {
    read: (id: string) => Promise<Tweet>;
}

export type Repository = ReadRepo & WriteRepo
