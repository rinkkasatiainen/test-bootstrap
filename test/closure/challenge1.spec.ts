import { expect } from 'chai'

function createFunction(): () => string {
    return () => 'Hello'
}

describe('challenge1', () => {
    describe('createFunction', () => {
        it('returns hello', () => {
            const createdFunction = createFunction()

            const result = createdFunction()

            expect(result).to.eql('Hello')
        })
    })
})
