import {Year} from '../entities/year'
import {Month} from '../entities/month'
import {Spending} from '../entities/spending'

export type PaymentsApi = (userId: string, year: Year, month: Month) => Spending[]
