import {expect} from 'chai'

import * as fs from 'fs'
import {ItemImpl, GildedRose} from '../../src/gilded-rose'

const items = [
    new ItemImpl('+5 Dexterity Vest', 10, 20), //
    new ItemImpl('Aged Brie', 2, 0), //
    new ItemImpl('Aged Brie', -1, 49), //
    new ItemImpl('Aged Brie', -1, 48), //
    new ItemImpl('Elixir of the Mongoose', 5, 7), //
    new ItemImpl('Elixir of the Mongoose', -1, 7), //
    new ItemImpl('Sulfuras, Hand of Ragnaros', 0, 80), //
    new ItemImpl('Sulfuras, Hand of Ragnaros', -1, 80),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', 15, 20),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', 10, 48),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', 10, 49),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', 5, 49),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', 5, 48),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', 5, 47),
    new ItemImpl('Backstage passes to a TAFKAL80ETC concert', -5, 47),
    new ItemImpl('Elixir of the Mongoose', 5, 7), //
    // this conjured item does not work properly yet
    new ItemImpl('Conjured Mana Cake', 3, 6)]

type Logger = (x: string) => Promise<void>

// eslint-disable-next-line no-undef
// const consoleLogger: Logger = text => new Promise(resolve => {
// // eslint-disable-next-line no-console
//     console.log;
//     resolve()
// })
const approvalsLogger: (filename: string) => Logger =
    filename => {
        fs.mkdir('./_approvals', err => {
            fs.writeFile(`./_approvals/${filename}`, '', () => {
            })// if (err) {
        })
        return text =>
            // eslint-disable-next-line no-undef
            new Promise((resolve, reject) => {
                fs.appendFile(`./_approvals/${filename}`, `${text}\n`, err => {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                })
            })

    }


const execute: (l: Logger) => Promise<void> =
    async logger => {

        const gildedRose = new GildedRose(items)
        const days = 2
        for (let i = 0; i <= days; i++) {
            /* eslint-disable no-console */
            await logger(`-------- day ${i} --------`)
            await logger('name, sellIn, quality')
            for (const element of gildedRose.items) {
                await logger(`${element.name} ${element.sellIn} ${element.quality}`)
            }
            await logger('')
            /* eslint-enable no-console */
            gildedRose.updateQuality()
        }
    }

describe('Gilded Rose approvals', () => {
    // it('should run', async () => {
    //     await execute(consoleLogger)
    // })
    it('should verify', async () => {
        await execute(approvalsLogger('actual.txt'))
        // eslint-disable-next-line no-undef
        await new Promise( (resolve, reject) => {
            fs.readFile('./_approvals/expected.txt', (err, expected) => {
                if (err) {
                    reject(err)
                }
                fs.readFile('./_approvals/actual.txt', (err2, actual) => {
                    expect(actual.toString()).to.eql(expected.toString())
                    resolve()
                })
            })
        })
    })
})

