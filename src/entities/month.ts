export class Month {
    private constructor(private readonly month: MonthT) {
    }

    public static of(m: MonthT): Month{
        return new Month(m)
    }

    public is(other: Month): boolean {
        return other.month === this.month
    }

    public previous(): Month {
        return new Month(this.month - 1)
    }
}

export type Months = keyof typeof MonthT
export enum MonthT {
    September = 9,
    October = 10
}
