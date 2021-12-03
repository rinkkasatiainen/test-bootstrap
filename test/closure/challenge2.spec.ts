/*
Challenge 2
2.1 Create a function createFunctionPrinter that accepts one input and returns a function.
2.2 When that created function is called, it should print out the input that was used when the function was created.
*/

import {expect} from 'chai'

function createFunctionPrinter(input: string): () => string {
    return () => input
}

describe('challenge2', () => {
    describe('createFunctionPrinter', () => {
        it('returns the given argument', () => {
            const argument = 'foo'
            const createdFunction = createFunctionPrinter(argument) // 2.1

            const result = createdFunction() // 2.2

            expect(result).to.eql(argument)
        })
    })
})
