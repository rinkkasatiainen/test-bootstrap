// eslint-disable-next-line max-classes-per-file
import { Dir, Directions, Location, Mars, MarsRover, RoverLander } from '../interfaces'
import { matcher } from '../utils/matcher'
import { LandedMarsRover } from './landedMarsRover'

export class MarsRoverLander implements RoverLander {
    public landOn(locationOn: Location, planet: Mars): MarsRover {
        return new LandedMarsRover(locationOn, createDir('N'))
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
