export function calculate(): number {
    return 1
}

export class Changer {
    private _availableCoins: number[] = [200, 100, 50, 20, 10, 5]
    public change(cents: number): number[] {
        const result = []
        for (const c of this._availableCoins){
            while ( cents >=  c ){
                result.push(c)
                cents -= c
            }
        }
        return result
    }
}
