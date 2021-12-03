import {expect} from 'chai'

function addS(inputString: string): string {
    return inputString + 's'
}

describe('challenge2', () => {
    describe('addS', () => {
        it('works', () => {
            expect(addS('pizza')).to.eql('pizzas')
            expect(addS('bagel')).to.eql('bagels')
        })
    })
})
