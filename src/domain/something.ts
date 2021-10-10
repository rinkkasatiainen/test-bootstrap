export interface Something {
    isUnusualSpending(): boolean;

    // this would probably be nice - instead of a query, but to give 'emailAPI' as argument saying
    // "if this is unusual spending, send something to 'this method'"...
    emailBody(): string;
}
