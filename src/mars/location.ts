import { Location } from '../interfaces'

export class MarsLocation implements Location {
    public constructor(private readonly xCoord: number, private readonly yCoord: number) {
    }

    public equals(other: Location): boolean {
        return other instanceof MarsLocation &&
            other.xCoord === this.xCoord &&
            other.yCoord === this.yCoord && true
    }
}
