/*
Challenge 3
Examine the code for the outer function. Notice that we are returning a
function and that function is using variables that are outside of its scope.

Uncomment those lines of code. Try to deduce the output before executing.
Now we are going to create a function addByX that returns a function that will add an input by x.

function outer() {
    let counter = 0; // this variable is outside incrementCounter's scope
    function incrementCounter () {
        counter ++;
        console.log('counter', counter);
    }
    return incrementCounter;
}

const willCounter = outer();
const jasCounter = outer();


*/

import {expect} from 'chai'

const outer1: () => () => number = () => {
    this.counter = 0
    return () => {
        this.counter++
        return this.counter
    }
}

function outer2(): () => number {
    this.counter = 0
    return () => {
        this.counter++
        return this.counter
    }
}

function outer3(): () => number {
    this.counter = 0

    function increment() {
        this.counter++
        return this.counter
    }

    return increment.bind(this)
}

class LooksLikeOuter {
    private counter: number

    constructor() {
        this.counter = 0
    }

    public callMe() {
        this.counter++
        return this.counter
    }
}

describe('challenge3', () => {
    describe('anonymous function closures', () => {
        it('works', () => {
            const boundObject = {
                counter: 100,
            }
            const f1 = outer3.apply(boundObject)
            const f2 = outer3.call(boundObject)

            f1()
            f1()
            f1()
            f2()

            const result = f1()
            expect(result).to.eql(5)
            expect(boundObject.counter).to.eql(5)
        })
    })
})
