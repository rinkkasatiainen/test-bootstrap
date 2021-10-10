import {Spending} from '../entities/spending'
import {Something} from '../domain/something'
import {Category} from '../entities/category'
import {Money} from '../entities/money'

export type Categorize = (x: { current: Spending[]; previous: Spending[] }) => Something
type CategoryKeys = keyof typeof Category
type CategoryForMoney = { [key in CategoryKeys]?: Money }

class CategHolder {
    private constructor(private readonly categ: CategoryForMoney) {
    }

    public static of(s: Spending[]): CategHolder {
        return new CategHolder(s.reduce((carry: CategoryForMoney, curr) => {
            const amount: Money = carry[curr.category] || Money.None()
            carry[curr.category] = amount.plus(curr.amount)
            return carry
        }, {}))
    }

    public isUnusualSpending(previousMonth: CategHolder): Category[] {
        const strings: Category[] = Object.keys(this.categ) as unknown as Category[]
        return strings
            .filter(c => previousMonth.categ[c] !== undefined)
            .filter(
                category => {
                    const prev: Money = previousMonth.categ[category] || Money.None()
                    const curr: Money = this.categ[category] || Money.None()
                    return curr.biggerThan(prev.times(1.5))
                }
            )
    }

    public asString(c: Category): string {
        const categElement = this.categ[c]
        return categElement ? `${categElement.toString()} ${c.toString()}` : ''
    }
}

export const categorize: Categorize = ({current, previous}) => {
    const currents: CategHolder = CategHolder.of(current)
    const prevx: CategHolder = CategHolder.of(previous)

    const unusualSpending = currents.isUnusualSpending(prevx)
    const result: Something = {
        emailBody(): string {
            return unusualSpending.map(c => currents.asString(c)).join(' | ')
        },
        isUnusualSpending: () => unusualSpending.length > 0,
    }

    return result
}
