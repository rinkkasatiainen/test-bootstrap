// an alias for possible key types.
export type PatternKeys = string | number | symbol

// generic type of which matching can be done.
export interface PatternMatchingType<K extends PatternKeys> {
    _type: K;
}

// this might create the type safety for the matcher.
type TypeMatcherMap<K extends PatternKeys, A, B> = {
    [key in K]: A extends { _type: key } ? A : never
}

//
type PatternMap<K extends PatternKeys, A extends PatternMatchingType<K>, B> = TypeMatcherMap<K, A, B>

export type Pattern<K extends PatternKeys, A extends PatternMatchingType<K>, B> = {
    [key in K]: (shape: PatternMap<K, A, B>[key]) => B
}
export const matcher:
    <K extends PatternKeys, A extends PatternMatchingType<K>, B>(pattern: Pattern<K, A, B>) => (shape: A) => B =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pattern => shape => pattern[shape._type](shape as any)


// Generic mathcher function
export type TypeKey = string

export type GenericPatternMatchingType<X extends TypeKey, K extends PatternKeys> = { [key in X]: K }

type GenericTypeMatcherMap<X extends TypeKey, K extends PatternKeys, A, B> = {
    [key in K]: A extends { [p in X]: key } ? A : never
}

type GenericPatternMap<X extends TypeKey, K extends PatternKeys, A, B> = GenericTypeMatcherMap<X, K, A, B>

export type GenericPattern<X extends TypeKey, K extends PatternKeys, A, B> = {
    [key in K]: (shape: GenericPatternMap<X, K, A, B>[key]) => B
}

export const genericMatcher:
    <X extends TypeKey, K extends PatternKeys, A extends GenericPatternMatchingType<X, K>, Res>(key: X) =>
        (pattern: GenericPattern<X, K, A, Res>) =>
            (shape: A) => Res =
    key => pattern => shape => pattern[shape[key]](shape as any)

export const genericMatcherFunc:
    <X extends TypeKey>(key: X) =>
        <K extends PatternKeys, A extends GenericPatternMatchingType<X, K>, R>(pattern: GenericPattern<X, K, A, R>) =>
            (shape: A) => R = <X extends TypeKey>
                (key: X) => <K extends PatternKeys, A extends GenericPatternMatchingType<X, K>, R>
                    (pattern: GenericPattern<X, K, A, R>) =>
                        (shape: A) =>
                            genericMatcher<X, K, A, R>(key)(pattern)(shape)
