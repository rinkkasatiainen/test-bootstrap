import { Directions, Location, Planet } from '../interfaces'
import { createDir } from '../rover/lander'
import { MarsLocation } from './location'

export class Mars implements Planet {
    public readonly obstacles: Location[] = []

    public addObstacle(location: Location): void {
        this.obstacles.push(location)
    }

    public distanceBetween(a: MarsLocation, b: MarsLocation) {
        return Math.abs(b.lat - a.lat) + Math.abs(b.lon - a.lon)
    }

    public antiClockwiseOf(d: Directions): Directions {
        switch (d) {
        case 'N':
            return 'W'
        case 'E':
            return 'N'
        case 'S':
            return 'E'
        case 'W':
            return 'S'
        }
    }

    public oppositeOf(d: Directions): Directions {
        switch (d) {
        case 'N':
            return 'S'
        case 'E':
            return 'W'
        case 'S':
            return 'N'
        case 'W':
            return 'E'
        }
    }

    public clockwiseOf(d: Directions): Directions {
        switch (d) {
        case 'N':
            return 'E'
        case 'E':
            return 'S'
        case 'S':
            return 'W'
        case 'W':
            return 'N'
        }
    }
}

export class DirectionTurning {
    public constructor(private readonly mars: Mars) {
    }

    public antiClockwiseOf(d: Directions) {
        return createDir(this.mars.antiClockwiseOf(d), this.mars)
    }

    public oppositeOf(d: Directions) {
        return createDir(this.mars.oppositeOf(d), this.mars)
    }

    public clockwiseOf(d: Directions) {
        return createDir(this.mars.clockwiseOf(d), this.mars)
    }

}
