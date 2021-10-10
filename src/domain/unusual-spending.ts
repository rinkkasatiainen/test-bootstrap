import {Month} from '../entities/month'
import {Year} from '../entities/year'
import {PaymentsApi} from '../api/payments.api'
import {EmailApi} from '../api/emailApi'

export interface UnusualSpending{
    calculate: (m: Month, y: Year) => void;
}

export class UnusualSpendingImpl implements UnusualSpending{
    public constructor(private readonly paymentsApi: PaymentsApi, private readonly emailApi: EmailApi) {

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public calculate(month: Month, year: Year): void {
        /* noop */
    }
}
