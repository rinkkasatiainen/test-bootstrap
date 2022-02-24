export const times: (x: number) => <A, B>(f: (x: A) => B) => (orig: A) => B = n => <A, B>(f: (x: A) => B) => first => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: B = Array(n).fill('').reduce((carry) => f(carry), first)

    return result
}
