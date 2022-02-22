import { expect } from 'chai'
import { Location, Mars } from '../../src/interfaces'
import { MarsLocation } from '../../src/mars/location'
import { MarsI } from '../../src/mars/planet'
import { MarsRoverLander } from '../../src/rover/lander'
import { RoverCommand } from '../../src/rover/command'


function aRandomLocationOn(mars: Mars): Location {
    return new MarsLocation(1, 1)
}

describe('Mars Rover', () => {
    it.skip('Can move forward and back to original spot', () => {
        const mars = new MarsI()
        const locationOn = aRandomLocationOn(mars)

        const lander = new MarsRoverLander()
        const rover = lander.landOn(locationOn)

        rover.execute(new RoverCommand('ffbb'))

        expect(rover.location()).to.eql(locationOn)
    })


    it.skip('Can move forward, turn 180 and back to original spot')
    it.skip('Can move as a circle')
    it.skip('Can move through whole sphere to original spot')

    describe('when sees obstacles', () => {
        it.skip('does not move if obstacle straight ahead', () => {
            expect(true).to.eql(false)
        })
        it('goes back to origial spot after obstacle')
    })
})
