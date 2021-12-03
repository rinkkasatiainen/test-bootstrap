import {expect} from 'chai'

// TODO: Fix Typescript compiler errors to make the callback accept a generic type and return that a generic result
function map(array: number[], callback: (input: unknown) => unknown): unknown[] {
    const newArray = []
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i = 0; i < array.length; i++) {
        newArray.push(callback(array[i]))
    }
    return newArray
}

describe('challenge3', () => {
    describe('map', () => {
        it('works', () => {
            const addTwo: (num: number) => number = (num) => num + 2
            expect(map([1, 2, 3], addTwo)).to.eql([3, 4, 5])
        })
    })
})
