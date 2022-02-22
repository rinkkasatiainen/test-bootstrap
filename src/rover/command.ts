import { Command } from '../interfaces'

export class RoverCommand implements Command {
    public constructor(private readonly cmd: string) {
    }
}
