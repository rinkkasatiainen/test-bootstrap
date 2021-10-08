import {expect} from 'chai'
import {convertToRoman} from '../src/convertToRoman'

describe('It', () => {
    describe('should', () => {
        it('converts base numbers', () => {
            expect(convertToRoman(5)).to.eql('V')
            expect(convertToRoman(1)).to.eql('I')
            expect(convertToRoman(10)).to.eql('X')
        })

        it('converts multiple of base numbers', () => {
            expect(convertToRoman(2)).to.eql('II')
            expect(convertToRoman(3)).to.eql('III')
            expect(convertToRoman(20)).to.eql('XX')
        })

        it('converts compound numbers', () => {
            expect(convertToRoman(8)).to.eql('VIII')
            expect(convertToRoman(17)).to.eql('XVII')
            expect(convertToRoman(33)).to.eql('XXXIII')
        })

        it('converts compound threshold numbers', () => {
            expect(convertToRoman(4)).to.eql('IV')
            expect(convertToRoman(9)).to.eql('IX')

            expect(convertToRoman(41)).to.eql('XLI')
            // expect(convertToRoman(494)).to.eql('CDXCIV')
        })
    })
})
/*

“1	I	60	LX
2	II	70	LXX
3	III	80	LXXX
4	IV	90	XC¡
5	V	100	C
6	VI	200	CC
7	VII	300	CCC
8	VIII	400	CD
9	IX	500	D
10	X	600	DC
20	XX	700	DCC
30	XXX	800	DCCC
40	XL	900	CM
50	L	1000	M
”

ClassOf.toRoman(1)  --> "I"
ClassOf.toRoman(33)  --> "XXXIII"
* */
