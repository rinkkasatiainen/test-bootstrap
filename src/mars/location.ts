import { Directions, Location } from '../interfaces'
import { matcher, PatternMatchingType } from '../utils/matcher'


interface Point {
    lat: number;
    lon: number;
}
type DirectionOf<K extends Directions> = PatternMatchingType<K> & Point
type North = DirectionOf<'N'>
type East = DirectionOf<'E'>
type South = DirectionOf<'S'>
type West = DirectionOf<'W'>
type Direction = North | East | South | West

const decreaseByOne = (x: number) => {
    const res = x - 1
    return res < -180 ? 180 : res
}

const increaseByOne = (x: number) => {
    const res = x + 1
    return res > 180 ? -180 : res
}

export class MarsLocation implements Location {
    private readonly c: Point

    public constructor(private readonly lat: number, private readonly lon: number) {
        this.c = { lat, lon }
    }

    public equals(other: Location): boolean {
        return other instanceof MarsLocation &&
            other.lat === this.lat &&
            other.lon === this.lon && true
    }

    public nextTo(direction: Directions): Location {
        return matcher<Directions, Direction, Location>({
            N: shape => new MarsLocation(decreaseByOne(shape.lat), shape.lon),
            E: shape => new MarsLocation(shape.lat, increaseByOne(shape.lon)),
            S: shape => new MarsLocation(increaseByOne(shape.lat), shape.lon),
            W: shape => new MarsLocation(shape.lat, decreaseByOne(shape.lon)),
        })({ ...this.c, _type: direction })
    }
}
