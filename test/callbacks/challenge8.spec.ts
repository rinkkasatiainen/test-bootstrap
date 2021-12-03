import { expect } from 'chai'

// TODO: Is using unknown the right approach?
// TODO: Figure out why ESLint complains about Set
// TODO: Find an approach using reduce
function union(...inputArrays: unknown[][]) {
    return [...new Set(inputArrays.flat())]
}

describe('challenge8', () => {
    describe('union', () => {
        it('works', () => {
            expect(union([5, 10, 15], [15, 88, 1, 5, 7], [100, 15, 10, 1, 5])).to.eql([5, 10, 15, 88, 1, 7, 100])
        })
    })
})
