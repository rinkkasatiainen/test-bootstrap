/*
Challenge 4
Write a function once that accepts a callback as input and returns a function.
When the returned function is called the first time, it should call the callback and return that output.
If it is called any additional times, instead of calling the callback again it will simply return the
output value from the first time it was called.

const addByTwo = addByX(2);
addByTwo(1); // => should return 3
addByTwo(2); // => should return 4
addByTwo(3); // => should return 5

const addByThree = addByX(3);
addByThree(1); // => should return 4
addByThree(2); // => should return 5

const addByFour = addByX(4);
addByFour(4); // => should return 8
addByFour(5); // => should return 9

*/

import {expect} from 'chai'

function addByX(augend: number): (addend: number) => number {
    return (addend) => augend + addend
}

const addByX2: (augend: number) => (addend: number) => number =
    augend => addend => augend + addend

type Func = (X: number) => number

const once: (f: Func) => Func = (f) => {
    let value: null | number = null
    return (addend) => {
        if (value === null) {
            value = f(addend)
        }
        return value
    }
}

describe('challenge4', () => {
    describe('memoize', () => {
        it('works', () => {
            // Arrange.
            const addByTwo = addByX(2)
            // Act.
            const result = addByTwo(2)
            // Assert
            expect(result).to.eql(4)
        })

        it('once', () => {
            // Arrange.
            const addByTwo = addByX2(2)
            const onceFunc = once(addByTwo)
            // Act.
            // Assert
            expect(onceFunc(2)).to.eql(4)
            expect(onceFunc(4)).to.eql(4)
        })
    })
})
