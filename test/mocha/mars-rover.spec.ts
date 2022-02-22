import { expect } from 'chai'

import { LandedMarsRover } from '../../src/rover/lander'
import { MarsLocation } from '../../src/mars/location'
import {} from '../utils/chai-matchers'

describe('MarsRover', () => {

    it('has a location', () => {
        const rover = new LandedMarsRover( new MarsLocation(1,1))

        const expectedLocation = new MarsLocation(1,1)
        expect(rover.location()).to.be.locationOf( expectedLocation )
    })

})
