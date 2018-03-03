'use strict'; // eslint-disable-line semi

const { expect } = require('chai')

const compile = require('./compile')

describe('`compile`', () => {

	it('can convert infx to postfix', () => {

		const infix = '-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)'
		const postfix = compile(infix)
		expect(postfix).to.equal('9 -1 * 2 * 3 7 + -1 * / 4 -1 * 1 * 2 / 21 -1 * - +')

	})

})
