import { expect } from 'chai'

import { MarsLocation } from '../../src/mars/location'
import { RoverCommand } from '../../src/rover/command'
import { LandedMarsRover } from '../../src/rover/landedMarsRover'
import { createDir } from '../../src/rover/lander'

describe('MarsRover', () => {
    const landingLocation = new MarsLocation(1, 1)

    it('has a location', () => {
        const rover = new LandedMarsRover(landingLocation, createDir('N'))

        expect(rover.location()).to.be.locationOf(landingLocation)
    })

    describe('given wrong commands', () => {
        it('does nothing', () => {
            const rover = new LandedMarsRover(landingLocation, createDir('N'))

            const marsCommand = RoverCommand.of('ffx')
            rover.execute(marsCommand)

            expect(rover.location()).to.be.locationOf(landingLocation)
        })
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

    describe('turning', () => {
        describe('when turning, does not move', () => {
            it('does nothing', () => {
                const rover = new LandedMarsRover(landingLocation, createDir('N'))

                const marsCommand = RoverCommand.of('l')
                rover.execute(marsCommand)

                expect(rover.location()).to.be.locationOf(landingLocation)
            })

            it('turning and moving forward is same as moving forward from different initial direction', () => {
                const roverNorth = new LandedMarsRover(landingLocation, createDir('N'))
                const roverWest = new LandedMarsRover(landingLocation, createDir('W'))

                roverNorth.execute(RoverCommand.of('f'))
                roverWest.execute(RoverCommand.of('lf'))

                expect(roverNorth.location()).to.be.locationOf(roverWest.location())
            })

            it('turning and moving backwards is same as moving forward from different initial direction', () => {
                const roverNorth = new LandedMarsRover(landingLocation, createDir('N'))
                const roverEast = new LandedMarsRover(landingLocation, createDir('E'))

                roverNorth.execute(RoverCommand.of('b'))
                roverEast.execute(RoverCommand.of('rb'))

                expect(roverNorth.location()).to.be.locationOf(roverEast.location())
            })
        })
    })
})
