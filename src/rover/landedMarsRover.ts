import { Cmds, Command, Dir, Directions, Location, MarsRover, MarsSingleCommand } from '../interfaces'
import { matcher } from '../utils/matcher'
import { Radar } from './lander'

interface DirectionEvent {
    _type: 'directionEvent';
    direction: Dir;
}

interface LocationEvent {
    _type: 'locationEvent';
    location: Location;
}

interface BlockedEvent {
    _type: 'blockedEvent';
    location: Location;
}

type Event = LocationEvent | DirectionEvent | BlockedEvent

export class LandedMarsRover implements MarsRover {
    private readonly events: Event[] = []

    public constructor(location: Location, direction: Dir, private readonly radar: Radar) {
        this.events = [{ _type: 'locationEvent', location }, { _type: 'directionEvent', direction }]
    }

    public execute(command: Command): void {
        const commands: MarsSingleCommand[] = []

        command.parse(cmd => {
            const event: Event = matcher<Cmds, MarsSingleCommand, Event>({
                B: (shape) => {
                    if (this.isObstacleOn(this.location(), this.direction().oppositeDirection()._type)) {
                        const blockOn = this.location().nextTo(this.direction().oppositeDirection()._type)!
                        return ({ _type: 'blockedEvent', location: blockOn })// do nothing
                    } else {
                        return ({
                            _type: 'locationEvent',
                            location: this.location().nextTo(this.direction().oppositeDirection()._type)!,
                        })
                    }
                },
                F: (shape) => {
                    if (this.isObstacleOn(this.location(), this.direction()._type)) {
                        const blockOn = this.location().nextTo(this.direction()._type)!
                        return ({ _type: 'blockedEvent', location: blockOn })// do nothing
                    } else {
                        return ({ _type: 'locationEvent', location: this.location().nextTo(this.direction()._type)! })
                    }
                },
                L: shape => ({ _type: 'directionEvent', direction: this.direction().clockWise() }),
                R: shape => ({ _type: 'directionEvent', direction: this.direction().antiClockWise() }),
            })(cmd)
            this.events.push(event)
            if (event._type === 'blockedEvent') {
                this.reverse(commands)
                return 'stop'
            }
            commands.push(cmd)
            return 'continue'
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

    public report(): Event[] {
        return [...this.events]
    }

    private reverse(commands: MarsSingleCommand[]) {
        for (const command of commands.reverse()) {
            const newEvent: Event =
                (command._type === 'B') ?
                    {
                        _type: 'locationEvent',
                        location: this.location().nextTo(this.direction()._type)!,
                    } :
                    (command._type === 'F') ?
                        {
                            _type: 'locationEvent',
                            location: this.location().nextTo(this.direction().oppositeDirection()._type)!,
                        } :
                        (command._type === 'L') ?
                            {
                                _type: 'directionEvent', direction: this.direction().oppositeDirection().clockWise(),
                            } :
                            {
                                _type: 'directionEvent',
                                direction: this.direction().oppositeDirection().antiClockWise(),
                            }
            this.events.push(newEvent)
        }

    }

    private direction(): Dir {
        const directions: Dir[] = this.events
            .filter(it => it._type === 'directionEvent')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .map((it: DirectionEvent) => it.direction)
        return directions[directions.length - 1]
    }

    private isObstacleOn(loc: Location, dir: Directions) {
        const obstacles = this.radar.getObstacles(this.location())
        const obstaclesInSight = obstacles.filter(o => o.loc.equals(loc.nextTo(dir)))
        return obstaclesInSight.length === 1
    }
}
