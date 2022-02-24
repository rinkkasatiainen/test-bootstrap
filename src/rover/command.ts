import { Cmds, Command, MarsSingleCommand } from '../interfaces'

const t = ['f', 'b', 'l', 'r']
const T = t.map(str => str.toUpperCase())

function assertX(x: string[]): x is Cmds[] {
    return x.map(str => str.toUpperCase()).filter(it => !T.includes(it)).length === 0
}

export class RoverCommand implements Command {
    private gen: Generator<Cmds>

    private constructor(cmd: Cmds[]) {
        function* generator() {
            for (const c of cmd) {
                yield c
            }
        }

        this.gen = generator()
    }


    public static of(cmd: string) {
        const strings: string[] = cmd.split('').map(it => it.toUpperCase())
        if (assertX(strings)) {
            return new RoverCommand(strings)
        }
        return new RoverCommand([])
    }

    public parse(callback: (cmd: MarsSingleCommand) => 'stop' | 'continue'): void {
        for (const genElement of this.gen) {
            const cmd: MarsSingleCommand = { _type: genElement }
            const result = callback(cmd)
            if (result === 'stop') {
                return
            }
        }
    }
}
