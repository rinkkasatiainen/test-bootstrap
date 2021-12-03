import { expect } from 'chai'

// TODO: Fix Typescript compiler errors to make the callback accept a generic type and return that a generic result
function mapWith(array: number[], callback: (input: unknown) => unknown): unknown[] {
    const newArray: unknown[] = []
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    array.forEach(item => {
        newArray.push(callback(item))
    })
    return newArray
}

describe('challenge5', () => {
    describe('mapWith', () => {
        it('works', () => {
            const addTwo: (num: number) => number = (num) => num + 2
            expect(mapWith([1, 2, 3], addTwo)).to.eql([3, 4, 5])
        })
    })
})
