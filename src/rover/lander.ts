// eslint-disable-next-line max-classes-per-file
import { Command, Location, MarsRover, RoverLander } from '../interfaces'

export class MarsRoverLander implements RoverLander {
    public landOn(locationOn: Location): MarsRover {
        return

    }
}

export class LandedMarsRover implements MarsRover {
    public constructor(private readonly secretLocation: Location) {
    }

    public execute(command: Command): void {
    }

    public location(): Location {
        return this.secretLocation
    }
}
