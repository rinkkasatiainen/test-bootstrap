export class Money {
    private constructor(private readonly eur: number, private readonly cents: number) {
    }

    public static EUR(eur: number, cents: number): Money {
        return new Money(eur, cents)
    }

    public static None(): Money {
        return new Money(0, 0)
    }

    public plus(other: Money): Money{
        return new Money(this.eur + other.eur, this.cents + other.cents)
    }

    public biggerThan( other: Money): boolean{
        return this.eur > other.eur || this.eur === other.eur  && this.cents > other.cents
    }

    public times(addend: number): Money{
        const cents = this.cents * addend
        if(cents >= 100){
            return new Money( this.eur * addend + Math.floor(cents / 100), cents % 100 )
        }
        return new Money(this.eur * addend, this.cents * addend)
    }

    public toString(): string {
        return `${this.eur}.${this.cents}`
    }
}
