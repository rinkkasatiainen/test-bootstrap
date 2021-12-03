import { expect } from 'chai'

// TODO: Is using unknown the right approach?
// TODO: Figure out why ESLint complains about Set
function union(...inputArrays: unknown[][]) {
    return [...new Set(inputArrays.flat())]
}

function unionWithReduce(...inputArrays: unknown[][]) {
    return inputArrays.reduce((newArray, currentArray) => newArray
        .concat(currentArray.filter(element => !newArray.includes(element))))
}

describe('challenge8', () => {
    describe('union', () => {
        it('works using Set', () => {
            expect(union([5, 10, 15], [15, 88, 1, 5, 7], [100, 15, 10, 1, 5])).to.eql([5, 10, 15, 88, 1, 7, 100])
        })

        it('works using reduce', () => {
            expect(unionWithReduce([5, 10, 15], [15, 88, 1, 5, 7], [100, 15, 10, 1, 5]))
                .to.eql([5, 10, 15, 88, 1, 7, 100])
        })
    })
})
