class TurnNumberSequence {
    private turnNumber: number;

    public constructor() {
        this.turnNumber = 0
    }

    public getNextTurnNumber(): number {
        return this.turnNumber++
    }
}

const sequence = new TurnNumberSequence()

export default sequence
