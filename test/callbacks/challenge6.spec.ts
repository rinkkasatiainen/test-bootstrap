import { expect } from 'chai'

const add = (a: number, b: number) => a + b

// TODO: Fix Typescript compiler errors to make the callback accept a generic type and return that a generic result
function reduce(array: unknown[], callback: (a: unknown, b: unknown) => unknown, initialValue: unknown) {
    let accumulatorValue: unknown = initialValue
    array.forEach(value => {
        accumulatorValue += value
    })
    return accumulatorValue
}

describe('challenge6', () => {
    describe('reduce', () => {
        it('works with add', () => {
            expect(reduce([1, 2, 3, 4], add, 0)).to.eql(10)
        })
    })
})
