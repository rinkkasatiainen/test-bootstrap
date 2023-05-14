import {expect} from 'chai'
import {Person} from '../../src/person'

describe('Person should', () => {
    const swedishPersonalNumber = '19511111-7668'
    const phoneNumber = '00467123456'

    describe('calculate', () => {

        it('birth year', () => {
            const person = new Person(Person.USER_ROLE_MANAGER, swedishPersonalNumber, phoneNumber)
            expect(person.birthYear()).to.eql(1951)
        })

        it('country code', () => {
            const person = new Person(Person.USER_ROLE_MANAGER, swedishPersonalNumber, phoneNumber)
            expect(person.countryCode()).to.eql('+46')
        })
        it('a standardised country code', () => {
            const person = new Person(Person.USER_ROLE_MANAGER, swedishPersonalNumber, '+46123456')
            expect(person.countryCode()).to.eql('+46')
        })
        it('local phone number', () => {
            const person = new Person(Person.USER_ROLE_MANAGER, swedishPersonalNumber, '0123456')
            expect(person.countryCode()).to.eql('')
        })
    })

    describe('actions based on roles', () => {
        it('manager can delete user', () => {
            const person = new Person(Person.USER_ROLE_MANAGER, swedishPersonalNumber, phoneNumber)
            expect(person.canDeleteUsers()).to.eql(true)
        })
        it('admin can delete user', () => {
            const person = new Person(Person.USER_ROLE_ADMIN, swedishPersonalNumber, phoneNumber)
            expect(person.canDeleteUsers()).to.eql(true)
        })
        it('sales cannot delete user', () => {
            const person = new Person(Person.USER_ROLE_SALES, swedishPersonalNumber, phoneNumber)
            expect(person.canDeleteUsers()).to.eql(false)
        })
        it('engineer cannot delete user', () => {
            const person = new Person(Person.USER_ROLE_ENGINEER, swedishPersonalNumber, phoneNumber)
            expect(person.canDeleteUsers()).to.eql(false)
        })
    })


})
