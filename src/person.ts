export class Person {

    static USER_ROLE_ADMIN = 0
    static USER_ROLE_ENGINEER = 1
    static USER_ROLE_MANAGER = 2
    static USER_ROLE_SALES = 3

    constructor(
        private readonly role: number,
        private readonly swedishPersonalNumber: string,
        private readonly phoneNumber: string) {

    }

    birthYear(): number {
        const year = this.swedishPersonalNumber.substring(0, 4)
        return parseInt(year, 10)
    }

    countryCode(): string {
        let code = ''
        if (this.phoneNumber.startsWith('00')) {
            code = this.phoneNumber.substring(2, 4)
        } else if (this.phoneNumber.startsWith('+')) {
            code = this.phoneNumber.substring(1, 3)
        }
        if (code !== '') {
            return `+${code}`
        }
        return ''

    }

    canDeleteUsers(): boolean {
        return this.role === Person.USER_ROLE_MANAGER || this.role === Person.USER_ROLE_ADMIN
    }
}
