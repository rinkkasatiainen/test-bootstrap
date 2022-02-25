import { PatternMatchingType } from './utils/matcher'
import { Mars } from './mars/planet'

export interface Planet {
    addObstacle(location: Location): void;
}

interface RoverSingleCommand<X> {cmd: X}
export type Forward = RoverSingleCommand<'F'>
export type Backward = RoverSingleCommand<'B'>
export type TurnLeft = RoverSingleCommand<'L'>
export type TurnRight = RoverSingleCommand<'R'>


export type MarsSingleCommand = Forward | Backward | TurnLeft | TurnRight
export type Cmds = MarsSingleCommand['cmd']

export interface MarsRover {
    execute(command: string): void;

    location(): Location;

    report(): unknown[];
}

export interface RoverLander {
    landOn: (locationOn: Location, planet: Mars) => MarsRover;
}

export type Directions = 'N' | 'S' | 'E' | 'W'
export interface Dir{
    goingTo: Directions;
    oppositeDirection: () => Dir;
    clockWise: () => Dir;
    antiClockWise: () => Dir;
}
export interface Location {
    equals: (other: Location) => boolean;

    nextTo(direction: Directions): Location;

    distanceFrom(locationOfRadar: Location): number;
}
