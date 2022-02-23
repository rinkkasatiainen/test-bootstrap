import { expect } from 'chai'

import { LandedMarsRover } from '../../src/rover/lander'
import { MarsLocation } from '../../src/mars/location'
import {} from '../utils/chai-matchers'
import { RoverCommand } from '../../src/rover/command'
import { Dir, Directions } from '../../src/interfaces'
import { matcher } from '../../src/utils/matcher'

const createDir: (x: Directions) => Dir = direction => ({
    _type: direction,
    oppositeDirection: () =>
        matcher<Directions, {_type: Directions}, Dir>({
            N: () => createDir('S'),
            E: () => createDir('W'),
            S: () => createDir('N'),
            W: () => createDir('E'),
        })({ _type: direction }),
})

describe('MarsRover', () => {
    const landingLocation = new MarsLocation(1, 1)

    it('has a location', () => {
        const rover = new LandedMarsRover(landingLocation, createDir('N'))

        expect(rover.location()).to.be.locationOf(landingLocation)
    })

    describe('going forward', () => {
        it('can take commands', () => {
            const rover = new LandedMarsRover(landingLocation, createDir('N'))

            const marsCommand = RoverCommand.of('f')
            rover.execute(marsCommand)

            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('N'))
        })

        it('can take multiple commands', () => {
            const rover = new LandedMarsRover(landingLocation, createDir('W'))
            const marsCommand = RoverCommand.of('ff')
            rover.execute(marsCommand)
            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('W').nextTo('W'))
        })

        it('can go backwards, too', () => {
            const rover = new LandedMarsRover(landingLocation, createDir('S'))
            const marsCommand = RoverCommand.of('bbfb')
            rover.execute(marsCommand)
            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('N').nextTo('N'))
        })
    })
})
