export enum ResultType {
    failure = '_failure',
    success = '_success'
}

export interface Result<T> {
    type: ResultType;
}

export interface Failure extends Result<never> {
    type: ResultType.failure;
    cause: string;
}

export interface Success<T> extends Result<T> {
    type: ResultType.success;
    data: T;
}

export const successOf: <T>(x: T) => Success<T> = data => ({ type: ResultType.success, data })
export const failureOf: (err: string) => Failure = cause => ({ type: ResultType.failure, cause})

export function isSuccess<T>(result: Result<T>): result is Success<T> {
    return result.type === ResultType.success
}
export function isFailure<T>(result: Result<T>): result is Failure {
    return result.type === ResultType.failure
}
