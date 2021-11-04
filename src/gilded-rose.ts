interface Item {
    name: string;
    sellIn: number;
    quality: number;

    updateQuality(): void;
}

export class ItemImpl implements Item {
    public constructor(public name: string, public sellIn: number, public quality: number) {
    }

    public updateQuality(): void {
        throw new Error('should not occur')
    }
}

export class GildedRose {
    public items: Item[]

    public constructor(items = [] as Item[]) {
        this.items = items
    }

    public updateQuality() {
        const result = []

        for (const item of this.items) {
            let updatedItem = createItem(item)
            updatedItem.updateQuality()


            result.push(updatedItem)

        }
        this.items = result
        return result
    }
}


class AgedBrie implements Item {
    public constructor(public readonly name: string, public quality: number, public sellIn: number) {
    }

    public updateQuality(): Item {
        if (this.quality < 50) {
            this.quality = this.quality + 1
        }
        this.sellIn = this.sellIn - 1
        if (this.sellIn < 0) {
            if (this.quality < 50) {
                this.quality = this.quality + 1
            }
        }
        return this
    }

    public static build(name: string, quality: number, sellIn: number): Item {
        return new AgedBrie(name, quality, sellIn)
    }
}

class BackstagePasses implements Item {
    public constructor(public readonly name: string, public quality: number, public sellIn: number) {
    }

    public updateQuality(): Item {
        if (this.quality < 50) {
            this.quality = this.quality + 1
            if (this.sellIn < 11) {
                if (this.quality < 50) {
                    this.quality = this.quality + 1
                }
            }
            if (this.sellIn < 6) {
                if (this.quality < 50) {
                    this.quality = this.quality + 1
                }
            }
        }
        this.sellIn = this.sellIn - 1
        if (this.sellIn < 0) {
            this.quality = this.quality - this.quality
        }
        return this
    }

    public static build(name: string, quality: number, sellIn: number): Item {
        return new BackstagePasses(name, quality, sellIn)
    }
}

class SulfurasHandOfRagnaros implements Item {
    public constructor(public readonly name: string, public quality: number, public sellIn: number) {
    }

    public updateQuality(): Item {
        return this
    }

    public static build(name: string, quality: number, sellIn: number): Item {
        return new SulfurasHandOfRagnaros(name, quality, sellIn)
    }
}

class NormalItem implements Item {
    public constructor(public readonly name: string, public quality: number, public sellIn: number) {
    }

    public updateQuality(): Item {
        if (this.quality > 0) {
            this.quality = this.quality - 1
        }
        this.sellIn = this.sellIn - 1
        if (this.sellIn < 0) {
            if (this.quality > 0) {
                this.quality = this.quality - 1
            }
        }
        return this
    }
}

const itemByName: {[key: string]: (a: string, b: number, c: number) => Item } = {
    'Aged Brie': AgedBrie.build,
    'Backstage passes to a TAFKAL80ETC concert': BackstagePasses.build,
    'Sulfuras, Hand of Ragnaros': SulfurasHandOfRagnaros.build,
}

function createItem(item: Item) {
    if (item.name in itemByName) {
        return itemByName[item.name](item.name, item.quality, item.sellIn)
    } else {
        return new NormalItem(item.name, item.quality, item.sellIn)
    }
}
