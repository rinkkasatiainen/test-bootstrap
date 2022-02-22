import { expect } from 'chai'
import { MarsLocation } from '../../src/mars/location'

describe('Location', () => {

    const origin = new MarsLocation(0, 0)
    const loc1by1 = new MarsLocation(1, 1)

    describe('equals', () => {
        it('is equal to itself', () => {
            expect(origin).to.be.locationOf( new MarsLocation(0, 0))
        })
        it('is not equal to neighbour point', () => {
            expect(origin).to.not.be.locationOf( new MarsLocation(0, 1))
        })
    })

    describe('nextPoint', () => {
        it('calculates next to all directions', () => {
            expect(loc1by1.nextTo('N')).to.be.locationOf( new MarsLocation(0, 1))
            expect(loc1by1.nextTo('S')).to.be.locationOf( new MarsLocation(2, 1))
            expect(loc1by1.nextTo('E')).to.be.locationOf( new MarsLocation(1, 2))
            expect(loc1by1.nextTo('W')).to.be.locationOf( new MarsLocation(1, 0))
        })
    })

    describe('sphere of Locations', () => {
        it('goes from -180 to 180', () => {
            const locBoundary = new MarsLocation(-180, -180)

            expect(locBoundary.nextTo('N')).to.be.locationOf( new MarsLocation(180, -180))
            expect(locBoundary.nextTo('W')).to.be.locationOf( new MarsLocation(-180, 180))
        })
        it('goes from 180 to -180', () => {
            const locBoundary = new MarsLocation(180, 180)

            expect(locBoundary.nextTo('S')).to.be.locationOf( new MarsLocation(-180, 180))
            expect(locBoundary.nextTo('E')).to.be.locationOf( new MarsLocation(180, -180))
        })
    })
})
