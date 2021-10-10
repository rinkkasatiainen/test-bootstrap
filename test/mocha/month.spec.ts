import {expect} from 'chai'
import {Month, MonthT} from '../../src/entities/month'

const october = Month.of(MonthT.October)
const september = Month.of(MonthT.September)
describe('Month', () => {
    it('should be same', () => {
        expect(Month.of(MonthT.October).is(october)).to.eql(true)
    })
    it('should be not same', () => {
        expect(september.is(october)).to.eql(false)
    })

    it('previous should match', () => {
        expect(october.previous().is(september)).to.eql(true)
    })
})
