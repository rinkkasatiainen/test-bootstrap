/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const chaiStatic = require('chai')
const sinonChai = require('sinon-chai')

// import chai from 'chai'
// import sinonChai from 'sinon-chai'

require('./utils/chai-matchers')

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
chaiStatic.use(sinonChai)

/*
** Disable truncate for expected and actual values in assertions.
** Remove this line to reset to the default of 40 if the objects
** printed are too big.
*/
chaiStatic.config.truncateThreshold = 0
