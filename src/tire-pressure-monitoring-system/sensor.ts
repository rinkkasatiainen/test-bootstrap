// The reading of the pressure value from the sensor is simulated in this implementation.
// Because the focus of the exercise is on the other class.

export default class Sensor {

    public popNextPressurePsiValue(): number {
        const pressureTelemetryValue = this.samplePressure()

        return this.offset() + pressureTelemetryValue
    }

    private samplePressure(): number {
        // placeholder implementation that simulate a real sensor in a real tire
        const pressureTelemetryValue = Math.floor(6 * Math.random() * Math.random())
        return pressureTelemetryValue
    }

    private offset(): number {
        return 16
    }

}
