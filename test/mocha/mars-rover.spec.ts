import { expect } from 'chai'

import { Location } from '../../src/interfaces'
import { MarsLocation } from '../../src/mars/location'
import { RoverCommand } from '../../src/rover/command'
import { LandedMarsRover } from '../../src/rover/landedMarsRover'
import { createDir, MarsRadar, Radar } from '../../src/rover/lander'
import { Mars } from '../../src/mars/planet'

function createMarsRover(landingLocation: MarsLocation, dir = createDir('S')) {
    return new LandedMarsRover(landingLocation, dir, new MarsRadar(new Mars()))
}

describe('MarsRover', () => {
    const landingLocation = new MarsLocation(1, 1)

    it('has a location', () => {
        const rover = createMarsRover(landingLocation, createDir('N'))

        expect(rover.location()).to.be.locationOf(landingLocation)
    })

    describe('given wrong commands', () => {
        it('does nothing', () => {
            const rover = createMarsRover(landingLocation, createDir('N'))

            const marsCommand = RoverCommand.of('ffx')
            rover.execute(marsCommand)

            expect(rover.location()).to.be.locationOf(landingLocation)
        })
    })

    describe('going forward', () => {
        it('can take commands', () => {
            const rover = createMarsRover(landingLocation, createDir('N'))

            const marsCommand = RoverCommand.of('f')
            rover.execute(marsCommand)

            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('N'))
        })

        it('can take multiple commands', () => {
            const rover = createMarsRover(landingLocation, createDir('W'))
            const marsCommand = RoverCommand.of('ff')
            rover.execute(marsCommand)
            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('W').nextTo('W'))
        })

        it('can go backwards, too', () => {
            const rover = createMarsRover(landingLocation, createDir('S'))
            const marsCommand = RoverCommand.of('bbfb')
            rover.execute(marsCommand)
            expect(rover.location()).to.be.locationOf(landingLocation.nextTo('N').nextTo('N'))
        })
    })

    describe('turning', () => {
        describe('when turning, does not move', () => {
            it('does nothing', () => {
                const rover = createMarsRover(landingLocation, createDir('N'))

                const marsCommand = RoverCommand.of('l')
                rover.execute(marsCommand)

                expect(rover.location()).to.be.locationOf(landingLocation)
            })

            it('turning and moving forward is same as moving forward from different initial direction', () => {
                const roverNorth = createMarsRover(landingLocation, createDir('N'))
                const roverWest = createMarsRover(landingLocation, createDir('W'))

                roverNorth.execute(RoverCommand.of('f'))
                roverWest.execute(RoverCommand.of('lf'))

                expect(roverNorth.location()).to.be.locationOf(roverWest.location())
            })

            it('turning and moving backwards is same as moving forward from different initial direction', () => {
                const roverNorth =createMarsRover(landingLocation, createDir('N'))
                const roverEast = createMarsRover(landingLocation, createDir('E'))

                roverNorth.execute(RoverCommand.of('b'))
                roverEast.execute(RoverCommand.of('rb'))

                expect(roverNorth.location()).to.be.locationOf(roverEast.location())
            })
        })
    })

    describe('Moving around', () => {
        it('can move in a circle', () => {
            const marsRover = createMarsRover(landingLocation)

            marsRover.execute(RoverCommand.of('flflflf'))

            expect(marsRover.location()).to.be.locationOf(landingLocation)
        })
    })

    describe('using a radar', () => {
        it('does not move if is blocked - going forward', () => {
            const fakeRadar: Radar = {
                getObstacles: (x: Location) => [ { loc: landingLocation.nextTo('N'), range: 1}]
            }
            const marsRover = new LandedMarsRover(landingLocation, createDir('N'), fakeRadar)

            marsRover.execute(RoverCommand.of('fff'))

            expect(marsRover.location()).to.be.locationOf(landingLocation)
        })

        it('does not move if is blocked - going backwards', () => {
            const fakeRadar: Radar = {
                getObstacles: (x: Location) => [ { loc: landingLocation.nextTo('S'), range: 1}]
            }
            const marsRover = new LandedMarsRover(landingLocation, createDir('N'), fakeRadar)

            marsRover.execute(RoverCommand.of('b'))

            expect(marsRover.location()).to.be.locationOf(landingLocation)
        })
    })
})
