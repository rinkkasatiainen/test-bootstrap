export interface Post {
    // id: string;
    // userId: string;
    // text: string;
    // dateTime: string;

    // save(store:
    //     (postId: string,
    //         text: string,
    //         userId: string,
    //         replyTo?: string,
    //         quote?: string,
    //         mentions?: string[]) => Promise<void>): Promise<void>;
    //
    // setReplyTo(postId: string): void;
}

// type StoreFunc = (postId: string, text: string, userId: string, replyTo?: string, quote?: string, mentions?: string[])
//     => Promise<void>

export class PostImpl implements Post {
}

export interface PostId { postId: string }
