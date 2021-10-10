import {Money} from './money'
import {Category} from './category'

export interface Spending {
    category: Category;
    amount: Money;
}
