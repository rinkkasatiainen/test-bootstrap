import { PatternMatchingType } from './utils/matcher'

export interface Mars {
}

export type Forward = PatternMatchingType<'F'>
export type Backward = PatternMatchingType<'B'>


export type MarsSingleCommand = Forward | Backward
export type Cmds = MarsSingleCommand['_type']

export interface Command {
    parse(param: (cmd: MarsSingleCommand) => void): void;
}

export interface MarsRover {
    execute(command: Command): void;

    location(): Location;
}

export interface RoverLander {
    landOn: (locationOn: Location) => MarsRover;
}

export type Directions = 'N' | 'S' | 'E' | 'W'
export interface Dir extends PatternMatchingType<Directions>{
    oppositeDirection: () => Dir;
}
export interface Location {
    equals: (other: Location) => boolean;

    nextTo(direction: Directions): Location;
}
