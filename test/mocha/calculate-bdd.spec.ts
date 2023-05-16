import {expect} from 'chai'
import {calculate} from '../../src/calculate'

describe('It', () => {
  describe('should', () => {
    it('fail', () => {
      expect(calculate()).to.eql(2)
    })
  })
})
