import { Cmds, Command, MarsSingleCommand } from '../interfaces'

const t = ['f', 'b', 'l', 'r']
const T = t.map(str => str.toUpperCase())

function assertX( x: string[]): x is Cmds[] {
    return x.map(str => str.toUpperCase()).filter(it => !T.includes(it)).length === 0
}

export class RoverCommand implements Command {
    private constructor(private readonly cmd: Cmds[]) {
    }

    public static of(cmd: string) {
        const strings: string[] = cmd.split('').map(it => it.toUpperCase())
        if( assertX(strings) ){
            return new RoverCommand( strings )
        }
        return new RoverCommand([])
    }

    public parse(callback: (cmd: MarsSingleCommand) => void): void {
        this.cmd.forEach( it => {
            const cmd: MarsSingleCommand = { _type: it }
            return callback(cmd)
        })
    }
}
