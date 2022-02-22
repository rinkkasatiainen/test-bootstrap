export interface Mars {
}

export interface Command {
    parse(param: (cmd: string) => void): void;
}

export interface MarsRover {
    execute(command: Command): void;

    location(): Location;
}

export interface RoverLander {
    landOn: (locationOn: Location) => MarsRover;
}

export type Directions = 'N' | 'S' | 'E' | 'W'
export interface Location {
    equals: (other: Location) => boolean;

    nextTo(direction: Directions): Location;
}
