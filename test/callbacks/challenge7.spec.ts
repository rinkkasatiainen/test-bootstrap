import { expect } from 'chai'

// TODO: Is using unknown throughout the right approach or is there a better way with generics?
function intersection(firstArray: unknown[], ...otherArrays: unknown[][]) {
    return firstArray.filter((value: unknown) => otherArrays.every(array => array.includes(value)))
}

function intersectionWithReduce(...inputArrays: unknown[][]) {
    return inputArrays.reduce((newArr, currentArray) => newArr.filter(element => currentArray.includes(element)))
}

describe('challenge7', () => {
    describe('intersection', () => {
        it('works with .filter() and .every()', () => {
            expect(intersection([5, 10, 15, 20], [15, 88, 1, 5, 7], [1, 10, 15, 5, 20])).to.eql([5, 15])
        })

        it('works with .reduce()', () => {
            expect(intersectionWithReduce([5, 10, 15, 20], [15, 88, 1, 5, 7], [1, 10, 15, 5, 20])).to.eql([5, 15])
        })
    })
})
