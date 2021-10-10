import chai, {expect} from 'chai'
import sinon, {SinonSpy, SinonStub} from 'sinon'
import sinonChai from 'sinon-chai'
import {UnusualSpendingImpl} from '../../src/domain/unusual-spending'
import {Money} from '../../src/entities/money'
import {Category} from '../../src/entities/category'
import {Spending} from '../../src/entities/spending'
import {Something} from '../../src/domain/something'
import {Month, MonthT} from '../../src/entities/month'
import {Year} from '../../src/entities/year'

chai.use(sinonChai)

const emailApi: SinonSpy = sinon.spy()
const paymentApiMock: SinonStub = sinon.stub()

const spending: (m: Money) => { of: (type: Category) => Spending } =
    amount => ({
        of: category => ({category, amount}),
    })

const categorize = sinon.stub()
describe('Unusual Spending', () => {

    it('calls paymentApi and forwards categorisation', () => {
        const unusualSpending = new UnusualSpendingImpl(paymentApiMock, emailApi, categorize)
        const month = Month.of(MonthT.October)
        const year = Year.of(2021)

        // Get's payment api calls.
        const current = [spending(Money.EUR(10, 0)).of(Category.restaurant)]
        const previous = [spending(Money.EUR(20, 0)).of(Category.restaurant)]
        paymentApiMock.withArgs('userId', year, month ).returns(current)
        paymentApiMock.withArgs('userId', year, month.previous() ).returns(previous)

        // paymentApiMock.onFirstCall().returns(current)
        // paymentApiMock.onSecondCall().returns(previous)

        const doesNotSendEmail: Something = {
            emailBody: () => '',
            isTrue: () => false,
        }
        // categorize
        categorize.returns(doesNotSendEmail)
        unusualSpending.calculate(month, year)

        expect(categorize).to.have.been.calledWith({current, previous})
        // send email, if needed

        expect(emailApi).to.not.have.been.called
    })
})
