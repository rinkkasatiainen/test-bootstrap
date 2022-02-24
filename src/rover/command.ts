import { Cmds, Command } from '../interfaces'

const t: Cmds[] = ['F', 'B', 'L', 'R']

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

        function assertStringIsValidCommands(x: string[]): x is Cmds[] {
            return x.map(str => str.toUpperCase()).filter(it => !(t as string[]).includes(it)).length === 0
        }

        if (assertStringIsValidCommands(strings)) {
            return new RoverCommand(strings)
        }
        return new RoverCommand([])
    }

    public parse(callback: (cmd: Cmds) => 'stop' | 'continue'): void {
        for (const cmd of this.gen) {
            const result = callback(cmd)
            if (result === 'stop') {
                return
            }
        }
    }
}

