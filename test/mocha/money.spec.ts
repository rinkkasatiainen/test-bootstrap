import chai, {expect} from 'chai'
import {Money} from "../../src/entities/money";


const Eur1 = Money.EUR(1, 0)
const Eur1_90 = Money.EUR(1, 90)
const Eur1_10 = Money.EUR(1, 10)
describe('Money', () => {
    describe('times', () => {
        it('times 1', () => {
            expect(Eur1.times(1)).to.eql(Eur1)
            expect(Eur1.times(1)).to.not.eq(Eur1)
        })
        it('times 2, when no cents', () => {
            expect(Eur1.times(2)).to.eql( Money.EUR(2, 0))
            expect(Eur1_10.times(2)).to.eql( Money.EUR(2, 20))
        })
        it('when cents > 100', () => {
            expect(Eur1_90.times(2)).to.eql( Money.EUR(3, 80))
        })
    })
})