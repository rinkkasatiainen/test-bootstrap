import { PatternMatchingType } from './utils/matcher'

export interface Planet {
    addObstacle(location: Location): void
}

export type Forward = PatternMatchingType<'F'>
export type Backward = PatternMatchingType<'B'>
export type TurnLeft = PatternMatchingType<'L'>
export type TurnRight = PatternMatchingType<'R'>


export type MarsSingleCommand = Forward | Backward | TurnLeft | TurnRight
export type Cmds = MarsSingleCommand['_type']

export interface Command {
    parse(param: (cmd: MarsSingleCommand) => 'stop' | 'continue'): void;
}

export interface MarsRover {
    execute(command: Command): void;

    location(): Location;

    report(): unknown[];
}

export interface RoverLander {
    landOn: (locationOn: Location, planet: Planet) => MarsRover;
}

export type Directions = 'N' | 'S' | 'E' | 'W'
export interface Dir extends PatternMatchingType<Directions>{
    oppositeDirection: () => Dir;
    clockWise: () => Dir;
    antiClockWise: () => Dir;
}
export interface Location {
    equals: (other: Location) => boolean;

    nextTo(direction: Directions): Location;

    distanceFrom(locationOfRadar: Location): number
}
