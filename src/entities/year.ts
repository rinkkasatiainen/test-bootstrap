export class Year {
    private constructor(private readonly year: number) {
    }

    public static of(year: number): Year {
        return new Year(year)
    }
}
