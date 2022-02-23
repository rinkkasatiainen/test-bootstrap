import { Cmds, Command, Dir, Location, MarsRover, MarsSingleCommand } from '../interfaces'
import { matcher } from '../utils/matcher'

interface DirectionEvent {
    _type: 'directionEvent';
    direction: Dir;
}

interface LocationEvent {
    _type: 'locationEvent';
    location: Location;
}

type Event = LocationEvent | DirectionEvent

export class LandedMarsRover implements MarsRover {
    private readonly events: Event[] = []

    public constructor(location: Location, direction: Dir) {
        this.events = [{ _type: 'locationEvent', location }, { _type: 'directionEvent', direction }]
    }

    public execute(command: Command): void {
        command.parse(cmd => {
            const event: Event = matcher<Cmds, MarsSingleCommand, Event>({
                B: (shape) => ({
                    _type: 'locationEvent',
                    location: this.location().nextTo(this.direction().oppositeDirection()._type),
                }),
                F: (shape) => ({ _type: 'locationEvent', location: this.location().nextTo(this.direction()._type ) }),
                L: shape => ({ _type: 'directionEvent', direction: this.direction().clockWise() }),
                R: shape => ({ _type: 'directionEvent', direction: this.direction().antiClockWise() }),
            })(cmd)
            this.events.push(event)
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

    private direction(): Dir {
        const directions: Dir[] = this.events
            .filter(it => it._type === 'directionEvent')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .map((it: DirectionEvent) => it.direction)
        return directions[directions.length - 1]
    }
}
