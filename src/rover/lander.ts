// eslint-disable-next-line max-classes-per-file
import { Cmds, Command, Dir, Directions, Location, MarsRover, MarsSingleCommand, RoverLander } from '../interfaces'
import { matcher } from '../utils/matcher'

export class MarsRoverLander implements RoverLander {
    public landOn(locationOn: Location): MarsRover {
        return new LandedMarsRover(locationOn, 'N')
    }
}

interface DirectionEvent {
    _type: 'directionEent';
    direction: Directions;
}

interface LocationEvent {
    _type: 'locationEvent';
    location: Location;
}

type Event = LocationEvent | DirectionEvent


export class LandedMarsRover implements MarsRover {
    private readonly events: Event[] = []

    public constructor(location: Location, private readonly direction: Dir) {
        this.events = [{ _type: 'locationEvent', location }, { _type: 'directionEent', direction: direction._type }]
    }

    public execute(command: Command): void {
        command.parse(cmd => {
            const location = matcher<Cmds, MarsSingleCommand, Location>({
                B: (shape) => {
                    return this.location().nextTo(this.direction.oppositeDirection()._type)
                },
                F: (shape) => {
                    return this.location().nextTo(this.direction._type)
                },
            })(cmd)
            this.events.push({ _type: 'locationEvent', location })
        })
    }

    public location(): Location {
        const locations: Location[] = this.events
            .filter(it => it._type === 'locationEvent')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .map((it: LocationEvent) => it.location)
        return locations[locations.length - 1]
    }
}
