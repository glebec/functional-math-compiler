'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const { expect } = chai

const { lex } = require('./1-lexer')

describe('`lex`', () => {

	/* eslint-disable no-unused-expressions */

	const isToken = maybeToken => 'type' in maybeToken

	const allTokens = maybeTokens => maybeTokens.every(isToken)

	it('is a function', () => {
		expect(lex).to.be.a('function')
	})

	it(`converts '' to List()`, () => {
		expect(lex('')).to.be.empty
	})

	it(`converts '1' to List<Number(1)>`, () => {
		const tokens = lex('1')
		expect(tokens).to.have.length(1)
		expect(allTokens(tokens)).to.be.true
		expect(tokens[0].type).to.equal('Number')
	})

	it(`converts '1+2' to proper tokens]`, () => {
		const tokens = lex('1+2')
		expect(tokens).to.have.length(3)
		expect(allTokens(tokens)).to.be.true
		expect(tokens[0].type).to.equal('Number')
		expect(tokens[1].type).to.equal('Plus')
		expect(tokens[2].type).to.equal('Number')
	})

	it(`converts '1 + 2', ignoring whitespace`, () => {
		const tokens = lex('1+2')
		expect(tokens).to.have.length(3)
		expect(allTokens(tokens)).to.be.true
		expect(tokens[0].type).to.equal('Number')
		expect(tokens[1].type).to.equal('Plus')
		expect(tokens[2].type).to.equal('Number')
	})

	it(`converts '-5 * (1  + 2)/ 3 '`, () => {
		const tokens = lex('-5 * (1  + 2)/ 3 ')
		expect(tokens).to.have.length(10)
		expect(allTokens(tokens)).to.be.true
		const expectedTypes = [
			'Minus',
			'Number',
			'Star',
			'LParen',
			'Number',
			'Plus',
			'Number',
			'RParen',
			'Slash',
			'Number',
		]
		expectedTypes.forEach((name, idx) =>
			expect(tokens[idx].type).to.equal(name)
		)
	})

	it('throws an error on invalid input', () => {
		const lexBad = () => lex('1 + ,2')
		expect(lexBad).to.throw()
	})

})
