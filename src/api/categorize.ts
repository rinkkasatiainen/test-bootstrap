import {Spending} from '../entities/spending'
import {Something} from '../domain/something'
import {Category} from '../entities/category'
import {Money} from '../entities/money'

export type Categorize = (x: { current: Spending[]; previous: Spending[] }) => Something
type CategoryKeys = keyof typeof Category
type CategoryForMoney = { [key in CategoryKeys]?: Money }

class CategHolder {
    constructor(private readonly categ: CategoryForMoney) {
    }

    public static of(s: Spending[]): CategHolder {
        return new CategHolder(s.reduce((carry: CategoryForMoney, curr) => {
            const amount: Money = (carry[curr.category] !== undefined) ? carry[curr.category]! : Money.None()
            carry[curr.category] = amount.plus(curr.amount)
            return carry
        }, {}))
    }

    public isUnusualSpending(previousMonth: CategHolder): Category[] {
        const strings: Category[] = Object.keys(this.categ) as unknown as Category[]
        return strings
            .filter(
                category => previousMonth.categ[category] &&
                    this.categ[category] &&
                    this.categ[category]!.biggerThan(previousMonth.categ[category]!.times(1.5))
            )
    }

    public asString(c: Category): string {
        const categElement = this.categ[c]
        return categElement? `${categElement.toString()} ${c.toString()}` : ''
    }
}

export const categorize: Categorize = ({current, previous}) => {
    const currents: CategHolder = CategHolder.of(current)
    const prevx: CategHolder = CategHolder.of(previous)

    const unusualSpending = currents.isUnusualSpending(prevx)
    const isTrue = unusualSpending.length > 0
    const emailBody = unusualSpending.map( c => currents.asString(c) )

    const result: Something = {
        emailBody(): string {
            return emailBody.join(' | ')
        },
        isTrue: () => isTrue,
    }

    return result
}
