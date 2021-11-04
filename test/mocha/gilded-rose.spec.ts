import { expect } from 'chai'
import { ItemImpl, GildedRose } from '../../src/gilded-rose'

describe('Gilded Rose', () => {

    it('should foo', () => {
        const gildedRose = new GildedRose([ new ItemImpl('foo', 0, 0) ])
        const items = gildedRose.updateQuality()
        expect(items[0].name).to.equal('foo')
    })

})
