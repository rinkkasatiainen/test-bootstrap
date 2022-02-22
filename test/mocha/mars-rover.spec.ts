import { expect } from 'chai'

import { LandedMarsRover } from '../../src/rover/lander'
import { MarsLocation } from '../../src/mars/location'
import {} from '../utils/chai-matchers'
import { RoverCommand } from '../../src/rover/command'

describe('MarsRover', () => {
    const landingLocation = new MarsLocation(1, 1)

    it('has a location', () => {
        const rover = new LandedMarsRover(landingLocation, 'N')

        expect(rover.location()).to.be.locationOf(landingLocation)
    })

    describe('going forward', () => {
        it('can take commands', () => {
            const rover = new LandedMarsRover(landingLocation, 'N')

            const marsCommand = new RoverCommand('f')
            rover.execute(marsCommand)

            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('N'))
        })

        it('can take multiple commands', () => {
            const rover = new LandedMarsRover(landingLocation, 'N')
            const marsCommand = new RoverCommand('ff')
            rover.execute(marsCommand)
            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('N').nextTo('N'))
        })
    })
})
