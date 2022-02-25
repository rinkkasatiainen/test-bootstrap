import { Directions, Location } from '../interfaces'
import { Mars } from './planet'

const decreaseByOne = (x: number) => {
    const res = x - 1
    return res < -180 ? 180 : res
}

const increaseByOne = (x: number) => {
    const res = x + 1
    return res > 180 ? -180 : res
}

export class MarsLocation implements Location {
    public constructor(public readonly lat: number, public readonly lon: number, private readonly mars: Mars) {
    }

    public equals(other: Location): boolean {
        return other instanceof MarsLocation &&
            other.lat === this.lat &&
            other.lon === this.lon
    }

    public nextTo(direction: Directions): Location {
        if (direction === 'N') {
            return new MarsLocation(decreaseByOne(this.lat), this.lon, this.mars)
        } else if (direction === 'E') {
            return new MarsLocation(this.lat, increaseByOne(this.lon), this.mars)
        } else if (direction === 'S') {
            return new MarsLocation(increaseByOne(this.lat), this.lon, this.mars)
        } else if (direction === 'W') {
            return new MarsLocation(this.lat, decreaseByOne(this.lon), this.mars)
        } else {
            return this
        }
    }

    public distanceFrom(other: Location): number {
        if (other instanceof MarsLocation) {
            return this.mars.distanceBetween(this, other)
        }
        return 0
    }
}
