export class Money {
    private constructor(private readonly eur: number, private readonly cents: number) {
    }

    public static EUR(eur: number, cents: number): Money {
        return new Money(eur, cents)
    }

    public static None(): Money {
        return new Money(0, 0)
    }
}
