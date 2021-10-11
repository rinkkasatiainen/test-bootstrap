import { expect } from 'chai'
import TelemetryDiagnosticControls from '../../src/telemetry-system/telemetry-diagnostic-controls'

describe('Telemetry System', () => {
    describe('TelemetryDiagnosticControls', () => {
        it('CheckTransmission should send a diagnostic message and receive a status message response', () => {
            new TelemetryDiagnosticControls()
            expect(true).to.eql(false)
        })
    })
})
