import {mocha} from 'approvals'
import {GildedRose, Item} from '../../src/gilded-rose'

mocha()

describe('Gilded Rose', function () {
    const items: string[] = ["Aged Brie", 'Backstage passes to a TAFKAL80ETC concert', 'Sulfuras, Hand of Ragnaros', 'any other']
    const sellIns: number[] = [-1, 0, 2, 6, 11]
    const qualities: number[] = [0, 1, 49, 50]

    for (const i of items) {
        for (const s of sellIns) {
            for (const q of qualities) {
                it(`GilderdRose of ${i}-${s}-${q}`, function () {
                    const gildedRose = new GildedRose([new Item(i, s, q)])
                    const items = gildedRose.updateQuality()

                    this.verifyAsJSON(items)
                })
            }
        }
    }


})
