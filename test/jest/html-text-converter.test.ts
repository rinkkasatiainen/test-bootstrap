import HtmlTextConverter from '../../src/text-converter/html-text-converter'

describe('Html Converter', () => {
    describe('HtmlTextConverter', () => {

        it('foo', () => {
            const converter = new HtmlTextConverter('foo')
            expect(converter.getFilename()).toEqual('fixme')
        })

    })

})
