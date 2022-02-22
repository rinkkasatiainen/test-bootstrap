import { Command } from '../interfaces'

export class RoverCommand implements Command {
    public constructor(private readonly cmd: string) {
    }

    public parse(callback: (cmd: string) => void): void {
        this.cmd.split('').forEach( it => callback(it))
    }
}
