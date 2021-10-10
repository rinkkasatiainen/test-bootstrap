import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {UnusualSpending, UnusualSpendingImpl} from '../../src/domain/unusual-spending'
import {Month, MonthT} from '../../src/entities/month'
import {Year} from '../../src/entities/year'
import {PaymentsApi} from '../../src/api/payments.api'
import {Category} from '../../src/entities/category'
import {Money} from '../../src/entities/money'
import {Spending} from '../../src/entities/spending'
import {EmailApi} from '../../src/api/emailApi'
import {categorize} from "../../src/api/categorize";

chai.use(sinonChai)

const spending: (m: Money) => { of: (type: Category) => Spending } =
    amount => ({
        of: category => ({category, amount}),
    })

const fakePaymentsOfSeptember = [
    spending(Money.EUR(10, 0)).of(Category.entertainment),
    spending(Money.EUR(90, 0)).of(Category.entertainment),
    spending(Money.EUR(50, 0)).of(Category.restaurant),
]
const fakePaymentsOfOctober: Spending[] = []

type FakePayments = {
    [key in MonthT]: Spending[]
}
const fakePaymentsApi: (x: FakePayments) => PaymentsApi =
    fakeRecords =>
        (userId, year, month) => {
            if (month.is(Month.of(MonthT.October))) {
                return fakeRecords[MonthT.October]
            }
            if (month.is(Month.of(MonthT.September))) {
                return fakeRecords[MonthT.September]
            }
            return []
        }

const emailAPINeverCalled: EmailApi = () => {
    throw new Error('Should not have been called in this tests')
}

const october = Month.of(MonthT.October)

describe('Unusual Spending Acceptance Test', () => {

    describe('FakePaymentsApi', () => {
        it('should return correct payments', () => {
            const paymentsApi = fakePaymentsApi({
                [MonthT.October]: fakePaymentsOfOctober,
                [MonthT.September]: fakePaymentsOfSeptember,
            })

            expect(paymentsApi('', Year.of(2021), october)).to.eql(fakePaymentsOfOctober)
            expect(paymentsApi('', Year.of(2021), october.previous())).to.eql(fakePaymentsOfSeptember)
        })
    })

    describe('when there is no spending this month', () => {


        it('should not have a side-effects', () => {
            const paymentsApi = fakePaymentsApi({
                [MonthT.October]: fakePaymentsOfOctober,
                [MonthT.September]: fakePaymentsOfSeptember,
            })
            const unusualSpending = new UnusualSpendingImpl(paymentsApi, emailAPINeverCalled, categorize)

            const month: Month = Month.of(MonthT.October)
            const year = Year.of(2021)
            unusualSpending.calculate(month, year)
        })
    })
    describe('when spending is less than 150%', () => {
        it('does not send email', () => {
            const paymentsApi = fakePaymentsApi({
                [MonthT.October]: fakePaymentsOfSeptember,
                [MonthT.September]: fakePaymentsOfSeptember,
            })

            const unusualSpending = new UnusualSpendingImpl(paymentsApi, emailAPINeverCalled, categorize)

            const month: Month = Month.of(MonthT.October)
            const year = Year.of(2021)
            unusualSpending.calculate(month, year)

            // expect(true).to.eql(false)
        })
    })
    describe('when spending is more than 150%', () => {
        it('does send email', () => {
            const emailApiSpy = sinon.spy()
            const paymentsApi = fakePaymentsApi({
                [MonthT.October]: [...fakePaymentsOfSeptember, ...fakePaymentsOfSeptember],
                [MonthT.September]: fakePaymentsOfSeptember,
            })

            const unusualSpending: UnusualSpending = new UnusualSpendingImpl(paymentsApi, emailApiSpy, categorize)

            const month: Month = Month.of(MonthT.October)
            const year = Year.of(2021)
            unusualSpending.calculate(month, year)

            expect(emailApiSpy).to.have.been.calledWith('userId', 'subject', '200.0 entertainment | 100.0 restaurant')
        })
    })
})
