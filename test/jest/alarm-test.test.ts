import Alarm from '../../src/tire-pressure-monitoring-system/alarm'

describe('Tyre Pressure Monitoring System', () => {
    describe('Alarm', () => {
        it('sometimes this fails', () => {
            const alarm = new Alarm()
            alarm.check()
            expect(alarm.isAlarmOn()).toEqual(false)
        })
    })

})
