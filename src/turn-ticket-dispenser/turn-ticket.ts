export default class TurnTicket {
    private turnNumber: number;

    public constructor(turnNumber: number) {
        this.turnNumber = turnNumber
    }

    public getTurnNumber(): number {
        return this.turnNumber
    }
}
