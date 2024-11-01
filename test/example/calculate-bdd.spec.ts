import {expect} from 'chai'
import {calculate} from '../../src/example/calculate.js'

describe('It', () => {
  describe('should', () => {
    it('fail', () => {
      expect(calculate()).to.eql(2)
    })
  })
})
