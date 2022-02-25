// eslint-disable-next-line max-classes-per-file
import { Dir, Directions, Location, MarsRover, RoverLander } from '../interfaces'
import { DirectionTurning, Mars } from '../mars/planet'
import { LandedMarsRover } from './landedMarsRover'

export interface Obstacle {
    loc: Location;
    range: number;
}

export interface Radar {
    getObstacles: (x: Location) => Obstacle[];
}

export class MarsRadar implements Radar {
    public constructor(private readonly planet: Mars) {
    }

    public getObstacles(locationOfRadar: Location): Obstacle[] {
        return this.planet.obstacles
            .map(it => ({ loc: it, range: it.distanceFrom(locationOfRadar) }))
            .filter(it => it.range < 3)
    }
}

export class MarsRoverLander implements RoverLander {
    public landOn(locationOn: Location, planet: Mars): MarsRover {
        return new LandedMarsRover(locationOn, createDir('N', planet), new MarsRadar(planet))
    }
}


export const createDir: (x: Directions, mars: Mars) => Dir = (direction, mars) => {
    const turning = new DirectionTurning(mars)
    return {
        goingTo: direction,
        oppositeDirection: () => turning.oppositeOf(direction),
        clockWise: () => turning.clockwiseOf(direction),
        antiClockWise: () => turning.antiClockwiseOf(direction),
    }
}
