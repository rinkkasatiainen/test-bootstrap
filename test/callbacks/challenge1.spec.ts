import {expect} from 'chai'

function addTwo(inputNumber: number): number {
    return inputNumber + 2
}

describe('challenge1', () => {
    describe('addTwo', () => {
        it('works', () => {
            expect(addTwo(3)).to.eql(5)
            expect(addTwo(10)).to.eql(12)
        })
    })
})
