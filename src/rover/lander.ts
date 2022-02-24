// eslint-disable-next-line max-classes-per-file
import { Dir, Directions, Location, Planet, MarsRover, RoverLander } from '../interfaces'
import { matcher } from '../utils/matcher'
import { Mars } from '../mars/planet'
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
        const closeBy = this.planet.obstacles
            .map(it => ({ loc: it, range: it.distanceFrom(locationOfRadar) }))
            .filter(it => it.range < 3)
        return closeBy
    }
}

export class MarsRoverLander implements RoverLander {
    public landOn(locationOn: Location, planet: Planet): MarsRover {
        return new LandedMarsRover(locationOn, createDir('N'), new MarsRadar(planet))
    }
}

export const createDir: (x: Directions) => Dir = direction => {
    const opposite = matcher<Directions, { _type: Directions }, Dir>({
        N: () => createDir('S'),
        E: () => createDir('W'),
        S: () => createDir('N'),
        W: () => createDir('E'),
    })
    const clockwise = matcher<Directions, { _type: Directions }, Dir>({
        N: () => createDir('E'),
        E: () => createDir('S'),
        S: () => createDir('W'),
        W: () => createDir('N'),
    })

    return ({
        _type: direction,
        oppositeDirection: () => opposite({ _type: direction }),
        clockWise: () => clockwise({ _type: direction }),
        antiClockWise: () => opposite(clockwise({ _type: direction })),
    })
}
