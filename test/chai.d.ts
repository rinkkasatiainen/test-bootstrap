import { Location } from '../src/interfaces'

declare module Chai {
    interface Assertion {
        locationOf(expectedText: Location): void;
    }
}
