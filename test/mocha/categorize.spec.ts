import chai, {expect} from 'chai'
import sinonChai from 'sinon-chai'
import {Money} from '../../src/entities/money'
import {Category} from '../../src/entities/category'
import {Spending} from '../../src/entities/spending'
import {categorize} from '../../src/api/categorize'


chai.use(sinonChai)
const spending: (m: Money) => { of: (type: Category) => Spending } =
    amount => ({
        of: category => ({category, amount}),
    })

describe('Categorize', () => {
    describe('when category does not exist previously', () => {
        it('it is not unusual', () => {
            const current = [spending(Money.EUR(10, 0)).of(Category.restaurant)]
            const previous = [spending(Money.EUR(1, 0)).of(Category.entertainment)]

            const result = categorize({previous, current})

            expect(result.isUnusualSpending()).to.eql(false)
        })

    })
    describe('just 1 category', () => {
        it('when spending is the same', () => {
            const current = [spending(Money.EUR(10, 0)).of(Category.restaurant)]
            const previous = [...current]

            const result = categorize({previous, current})

            expect(result.isUnusualSpending()).to.eql(false)
        })

        it('when one spending is 200% more', () => {
            const current = [spending(Money.EUR(20, 0)).of(Category.restaurant)]
            const previous = [spending(Money.EUR(10, 0)).of(Category.restaurant)]

            const result = categorize({previous, current})

            expect(result.isUnusualSpending()).to.eql(true)
        })

        it('when one spending is twice the value', () => {
            const current = [
                spending(Money.EUR(10, 0)).of(Category.restaurant),
                spending(Money.EUR(10, 0)).of(Category.restaurant),
            ]
            const previous = [spending(Money.EUR(10, 0)).of(Category.restaurant)]

            const result = categorize({previous, current})

            expect(result.isUnusualSpending()).to.eql(true)
        })
    })

    describe('multiple categories', () => {
        let current: Spending[] = []
        let previous: Spending[] = []
        describe('when there is no increase more thant 150%', () => {
            beforeEach(() => {
                current = [
                    spending(Money.EUR(10, 0)).of(Category.restaurant),
                    spending(Money.EUR(5, 15)).of(Category.restaurant),
                    spending(Money.EUR(10, 0)).of(Category.entertainment),
                    spending(Money.EUR(5, 0)).of(Category.entertainment),
                ]
                previous = [
                    spending(Money.EUR(10, 10)).of(Category.restaurant),
                    spending(Money.EUR(10, 0)).of(Category.entertainment),
                ]
            })
            it('when there is not more than 50% increase on both - no email', () => {
                const result = categorize({previous, current})

                expect(result.isUnusualSpending()).to.eql(false)
            })
            it('when there is not more than 50% increase on both - no email body', () => {
                const result = categorize({previous, current})

                expect(result.emailBody()).to.eql('')
            })
        })
        describe('when there is increase more thant 150%', () => {
            beforeEach(() => {
                previous = [
                    spending(Money.EUR(10, 10)).of(Category.restaurant),
                    spending(Money.EUR(10, 0)).of(Category.entertainment),
                ]
                current = [...previous, ...previous]
            })
            it('when there is more than 50% increase on both ', () => {
                const result = categorize({previous, current})

                expect(result.isUnusualSpending()).to.eql(true)
            })
            it('when there is more than 50% increase on both - email', () => {
                const result = categorize({previous, current})

                expect(result.emailBody()).to.eql('20.20 restaurant | 20.0 entertainment')
            })
        })
    })
})
