import { Cmds, Dir, Location, MarsRover } from '../interfaces'
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

const availableCommands: Cmds[] = ['F', 'B', 'L', 'R']

function assertStringIsValidCommands(x: string[]): x is Cmds[] {
    return x.map(str => str.toUpperCase()).filter(it => !(availableCommands as string[]).includes(it)).length === 0
}

export class LandedMarsRover implements MarsRover {
    private readonly events: Event[] = []
    private reverseCommands: Cmds[] | undefined

    public constructor(location: Location, direction: Dir, private readonly radar: Radar) {
        this.events = [{ _type: 'locationEvent', location }, { _type: 'directionEvent', direction }]
    }

    public execute(commandAsString: string): void {
        const strings: string[] = commandAsString.split('').map(it => it.toUpperCase())
        // This either has all valid commmands, or no commands at all.
        const command = assertStringIsValidCommands(strings) ? strings : []

        function* generator() {
            for (const c of command) {
                yield c
            }
        }

        // generator goes through all the commands.
        const gen = generator()

        const commands: Cmds[] = []

        for (const cmd of gen) {
            const newEvent = this.getEvent(cmd)

            this.events.push(newEvent)
            if (newEvent._type === 'blockedEvent') {
                // set reverseCommands so that we know we actually need to reverse to original location
                this.reverseCommands = commands
                break
            }
            commands.push(cmd)
        }

        if (this.reverseCommands) {
            this.reverse(this.reverseCommands)
            this.reverseCommands = undefined
        }
    }

    public location(): Location {
        function isLocation(x: Event): x is LocationEvent {
            return x._type === 'locationEvent'
        }

        const locations: Location[] = this.events.filter(isLocation).map((it: LocationEvent) => it.location)
        return locations[locations.length - 1]
    }

    public report(): Event[] {
        return [...this.events]
    }

    private getEvent(cmd: 'F' | 'B' | 'L' | 'R'): Event {
        switch (cmd) {
        case 'B': {
            const nextLocation = this.location().nextTo(this.direction().oppositeDirection()._type)!
            if (this.isObstacleOn(this.location(), nextLocation, 1)) {
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
            if (this.isObstacleOn(this.location(), nextLocation, 1)) {
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
        function isDirection(x: Event): x is DirectionEvent {
            return x._type === 'directionEvent'
        }

        const directions: Dir[] = this.events.filter(isDirection).map((it: DirectionEvent) => it.direction)
        return directions[directions.length - 1]
    }

    private isObstacleOn(loc: Location, nextLocation: Location, range: number) {
        const obstacles = this.radar.getObstacles(this.location())
        const obstaclesInSight = obstacles.filter(
            o => o.loc.equals(nextLocation) && o.loc.distanceFrom(nextLocation) <= range,
        )
        return obstaclesInSight.length === 1
    }
}
