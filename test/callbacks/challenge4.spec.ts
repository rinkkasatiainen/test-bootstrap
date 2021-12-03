import {expect} from 'chai'

// TODO: Fix Typescript compiler errors to make the callback accept a generic type and return that a generic result
function forEach(array: unknown[], callback: (input: unknown) => void) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < array.length; i++) {
        callback(array[i])
    }
}

describe('challenge4', () => {
    describe('forEach', () => {
        it('works', () => {
            const letterPositions = [2, 1, 18]
            let resultString = ''

            function mapCharacter(position: number) {
                const alphabet = [...'abcdefghijklmnopqrstuvwxyz']
                resultString += alphabet[position - 1]
            }

            forEach(letterPositions, mapCharacter)

            expect(resultString).to.eql('bar')
        })
    })
})
