import { Directions, Location } from '../interfaces'

const decreaseByOne = (x: number) => {
    const res = x - 1
    return res < -180 ? 180 : res
}

const increaseByOne = (x: number) => {
    const res = x + 1
    return res > 180 ? -180 : res
}

export class MarsLocation implements Location {
    public constructor(private lat: number, private lon: number) {
    }

    public equals(other: Location): boolean {
        return other instanceof MarsLocation &&
            other.lat === this.lat &&
            other.lon === this.lon && true
    }

    public nextTo(direction: Directions): Location | undefined {
        if( direction === 'N'){
            return new MarsLocation(decreaseByOne(this.lat), this.lon)
        }
        if( direction === 'E'){
            return new MarsLocation(this.lat, increaseByOne(this.lon))
        }
        if( direction === 'S'){
            return new MarsLocation(increaseByOne(this.lat), this.lon)
        }
        if( direction === 'W'){
            return new MarsLocation(this.lat, decreaseByOne(this.lon))
        }
        return
    }

    public distanceFrom(other: Location): number {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return Math.abs(other.lat - this.lat) + Math.abs(other.lon - this.lon) ;
    }
}
