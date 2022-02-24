import { expect } from 'chai'
import { Location, Planet } from '../../src/interfaces'
import { MarsLocation } from '../../src/mars/location'
import { Mars } from '../../src/mars/planet'
import { MarsRoverLander } from '../../src/rover/lander'


function aRandomLocationOn(mars: Planet): Location {
    return new MarsLocation(Math.floor(Math.random() * 180), Math.floor(Math.random() * 180))
}

describe('Mars Rover', () => {
    let mars: Planet
    let locationOn: Location
    let lander: MarsRoverLander

    beforeEach(() => {
        mars = new Mars()
        locationOn = aRandomLocationOn(mars)
        lander = new MarsRoverLander()
    })
    it('Can move forward and back to original spot', () => {
        const rover = lander.landOn(locationOn, mars)

        rover.execute('ffbb')

        expect(rover.location()).to.eql(locationOn)
    })

    it('can move in a circle', () => {
        const marsRover = lander.landOn(locationOn, mars)

        marsRover.execute('flflflf')

        expect(marsRover.location()).to.be.locationOf(locationOn)
    })
    it('Can move forward, turn 180 and back to original spot')
    it('Can move as a circle')
    it('Can move through whole sphere to original spot')

    describe('when sees obstacles', () => {
        it('does not move if obstacle straight ahead', () => {
            mars.addObstacle(locationOn.nextTo('N'))
            const rover = lander.landOn(locationOn, mars)

            rover.execute('ff')

            expect(rover.location()).to.eql(locationOn)
        })
        it('goes back to origial spot after obstacle', () => {
            mars.addObstacle(locationOn.nextTo('N').nextTo('E'))
            const rover = lander.landOn(locationOn, mars)

            rover.execute('flf')

            expect(rover.report().map((it: unknown) => it._type)).to.eql([
                'locationEvent', 'directionEvent',
                'locationEvent',
                'directionEvent',
                'blockedEvent',
                'directionEvent',
                'locationEvent',
            ])

            expect(rover.location()).to.eql(locationOn)
        })
    })
})
