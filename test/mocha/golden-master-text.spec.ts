import {Item, GildedRose} from '../../src/gilded-rose'

const items = [
    new Item('+5 Dexterity Vest', 10, 20), //
    new Item('Aged Brie', 2, 0), //
    new Item('Elixir of the Mongoose', 5, 7), //
    new Item('Elixir of the Mongoose', -1, 7), //
    new Item('Sulfuras, Hand of Ragnaros', 0, 80), //
    new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
    new Item('Backstage passes to a TAFKAL80ETC concert', 10, 48),
    new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),
    new Item('Elixir of the Mongoose', 5, 7), //
    // this conjured item does not work properly yet
    new Item('Conjured Mana Cake', 3, 6)]

type Logger = (x: string) => Promise<void>

// eslint-disable-next-line no-undef
const consoleLogger: Logger = text => new Promise(resolve => {
// eslint-disable-next-line no-console
    console.log(text)
    resolve()
})

const execute: (l: Logger) => Promise<void> =
    async logger => {

        const gildedRose = new GildedRose(items)
        const days = 2
        for (let i = 0; i < days; i++) {
            await logger(`-------- day ${i} --------`)
            await logger('name, sellIn, quality')
            for (const element of items) {
                await logger(`${element.name} ${element.sellIn} ${element.quality}`)
            }
            await logger('')
            gildedRose.updateQuality()
        }
    }

describe('Gilded Rose approvals', () => {
    it('should run', async () => {
        await execute(consoleLogger)
    })
})

