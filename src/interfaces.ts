export interface Mars {
}

export interface Command {
}

export interface MarsRover {
    execute(command: Command): void;

    location(): Location;
}

export interface RoverLander {
    landOn: (locationOn: Location) => MarsRover;
}

export interface Location {
    equals: (other: Location) => boolean;
}
