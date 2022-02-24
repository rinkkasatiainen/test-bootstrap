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

interface UnknownCommand {
    _type: 'unknownCommand';
}

type Event = LocationEvent | DirectionEvent | BlockedEvent | UnknownCommand

export class LandedMarsRover implements MarsRover {
    private readonly events: Event[] = []

    public constructor(location: Location, direction: Dir, private readonly radar: Radar) {
        this.events = [{ _type: 'locationEvent', location }, { _type: 'directionEvent', direction }]
    }

    public execute(command: Command): void {
        const commands: Cmds[] = []

        command.parse(cmd => {

            const newEvent = this.getEvent(cmd)

            this.events.push(newEvent)
            if (newEvent._type === 'blockedEvent') {
                this.reverse(commands)
                return 'stop'
            }
            commands.push(cmd)
            return 'continue'
        })
    }

    private getEvent(cmd: 'F' | 'B' | 'L' | 'R'): Event {
        switch (cmd) {
        case 'B': {
            const nextLocation = this.location().nextTo(this.direction().oppositeDirection()._type)!
            if (this.isObstacleOn2(this.location(), nextLocation)) {
                return { _type: 'blockedEvent', location: nextLocation }
            } else {
                return {
                    _type: 'locationEvent',
                    location: this.location().nextTo(this.direction().oppositeDirection()._type)!,
                }
            }
        }
        case 'F': {
            const nextLocation = this.location().nextTo(this.direction()._type)!
            if (this.isObstacleOn2(this.location(), nextLocation)) {
                return { _type: 'blockedEvent', location: nextLocation }
            } else {
                return {
                    _type: 'locationEvent',
                    location: this.location().nextTo(this.direction()._type)!,
                }
            }
        }
        case 'L': {
            return { _type: 'directionEvent', direction: this.direction().clockWise() }
        }
        case 'R': {
            return { _type: 'directionEvent', direction: this.direction().antiClockWise() }

        }
        default:
            return { _type: 'unknownCommand' }
        }
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

    private reverse(commands: Cmds[]) {
        for (const command of commands.reverse()) {
            const newEvent: Event =
                (command === 'B') ?
                    {
                        _type: 'locationEvent',
                        location: this.location().nextTo(this.direction()._type)!,
                    } :
                    (command === 'F') ?
                        {
                            _type: 'locationEvent',
                            location: this.location().nextTo(this.direction().oppositeDirection()._type)!,
                        } :
                        (command === 'L') ?
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

    private isObstacleOn2(loc: Location, loc2: Location) {
        const obstacles = this.radar.getObstacles(this.location())
        const obstaclesInSight = obstacles.filter(o => o.loc.equals(loc2))
        return obstaclesInSight.length === 1
    }
}
