import {Month} from '../entities/month'
import {Year} from '../entities/year'
import {PaymentsApi} from '../api/payments.api'
import {EmailApi} from '../api/emailApi'
import {Categorize} from '../api/categorize'

export interface UnusualSpending {
    calculate: (m: Month, y: Year) => void;
}

export class UnusualSpendingImpl implements UnusualSpending {
    public constructor(
        private readonly paymentsApi: PaymentsApi,
        private readonly emailApi: EmailApi,
        private readonly categorize: Categorize) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public calculate(month: Month, year: Year): void {
        const current = this.paymentsApi('userId', year, month)
        const previous = this.paymentsApi('userId', year, month.previous())

        const something = this.categorize({current, previous})

        if (something.isTrue()) {
            this.emailApi('userId', 'subject', something.emailBody())
        }
        /* noop */
    }
}
