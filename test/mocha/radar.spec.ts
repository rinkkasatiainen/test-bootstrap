import { expect } from 'chai'

import { Location } from '../../src/interfaces'
import { Mars } from '../../src/mars/planet'
import { MarsLocation } from '../../src/mars/location'
import { MarsRadar } from '../../src/rover/lander'

const times: (x: number) => <A, B>(f: (x: A) => B) => (orig: A) => B = n => <A, B>(f: (x: A) => B) => first => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: B = Array(n).fill('').reduce((carry) => f(carry), first)

    return result
}

describe('MarsRadar', () => {
    const location = new MarsLocation(10, 10)
    let planet: Mars
    beforeEach(() => {
        planet = new Mars()
    })
    describe('finds All nearby obstacles', () => {
        it('to North', () => {
            planet.addObstacle(location.nextTo('N'))

            const result = new MarsRadar(planet).getObstacles(location)

            expect(result).to.eql([{ loc: location.nextTo('N'), range: 1 }])
        })
    })

    describe('does not find which are more than 2 away', () => {
        it('does not find from 3 ', () => {
            const l = times(3)<Location, Location>(loc => loc.nextTo('N'))(location)
            planet.addObstacle(l)

            const result = new MarsRadar(planet).getObstacles(location)

            expect(result).to.eql([])
        })

        it('does find from 2 ', () => {
            const l = times(2)<Location, Location>(loc => loc.nextTo('W'))(location)
            planet.addObstacle(l)

            const result = new MarsRadar(planet).getObstacles(location)

            expect(result).to.eql([{ loc: location.nextTo('W').nextTo('W'), range: 2}])
        })

        it('does find from SE ', () => {
            planet.addObstacle(location.nextTo('S').nextTo('E'))

            const result = new MarsRadar(planet).getObstacles(location)

            expect(result).to.eql([{ loc: location.nextTo('E').nextTo('S'), range: 2}])
        })
    })
})
