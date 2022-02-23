import { Assertion } from 'chai'
import { Location } from '../../src/interfaces'
import { MarsLocation } from '../../src/mars/location'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Chai {
        interface Assertion {
            locationOf(expectedText: Location): void;
        }
    }
}

// eslint-disable-next-line no-console
console.log('adding custom matcher for \'locationOf\'')
Assertion.addMethod('locationOf', function(loc: Location) {
    const obj: Location = this._obj as Location

    // first, our instanceof check, shortcut
    new Assertion(this._obj).to.be.instanceof(MarsLocation)

    // second, our type check
    this.assert(
        obj.equals(loc)
        , 'expected #{this} to be of type #{exp} but got #{act}'
        , 'expected #{this} to not be of type #{act}'
        , loc       // expected
        , obj   // actual
    )
})
