'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const { expect } = chai

const { lex } = require('./1-lexer')

// helper function
const verify = tokens => ({
	areTokensWithTypes (types) {
		expect(tokens).to.have.length(types.length)
		tokens.forEach((token, idx) => {
			expect(token).to.be.an('object').with.property('type', types[idx])
		})
	},
})

describe('lexer `lex`', () => {

	describe('basics:', () => {

		it(`converts '' to an array of no tokens`, () => {
			expect(lex('')).to.be.empty
		})

		it(`converts '5' to an array of one Number token`, () => {
			const tokens = lex('5')
			expect(tokens).to.have.length(1)
			expect(tokens[0]).to.be.an('object')
				.with.property('type', 'Number')
		})

		it(`converts '452' to an array of one Number token`, () => {
			const tokens = lex('452')
			// from now on we will use this helper function
			verify(tokens).areTokensWithTypes(['Number'])
		})

		it(`converts '+' to an array of one Plus token`, () => {
			verify(lex('+')).areTokensWithTypes(['Plus'])
		})

		it(`converts '1+2' to an array of three tokens`, () => {
			verify(lex('1+2')).areTokensWithTypes([
				'Number',
				'Plus',
				'Number',
			])
		})

		it(`converts '45+1293' to an array of three tokens`, () => {
			verify(lex('45+1293')).areTokensWithTypes([
				'Number',
				'Plus',
				'Number',
			])
		})

		it(`converts '  45+  1293 ', ignoring whitespace`, () => {
			verify(lex('  45+  1293 ')).areTokensWithTypes([
				'Number',
				'Plus',
				'Number',
			])
		})

	})

	describe('numbers:', () => {

		it(`converts '426' to a Number token with value '426'`, () => {
			const token = lex('426')[0]
			expect(token).to.be.an('object')
			expect(token).to.have.property('type', 'Number')
			expect(token).to.have.property('value', '426')
		})

		it(`converts '32 + 8 + 101', including values for Numbers`, () => {
			const tokens = lex('32 + 8 + 101')
			verify(tokens).areTokensWithTypes([
				'Number',
				'Plus',
				'Number',
				'Plus',
				'Number',
			])
			expect(tokens[0]).to.have.property('value', '32')
			expect(tokens[2]).to.have.property('value', '8')
			expect(tokens[4]).to.have.property('value', '101')
		})

	})

	describe('short inputs:', () => {

		const examples = [
			{ input: '5', type: 'Number' },
			{ input: '(', type: 'LParen' },
			{ input: ')', type: 'RParen' },
			{ input: '*', type: 'Star' },
			{ input: '/', type: 'Slash' },
			{ input: '+', type: 'Plus' },
			{ input: '-', type: 'Minus' },
		]

		examples.forEach(example => {
			it(`converts ${example.input} to an array of one ${example.type} token`, () => {
				verify(lex(example.input)).areTokensWithTypes([example.type])
			})
		})

	})

	describe('long inputs:', () => {

		it(`converts '2 - 1/2'`, () => {
			const tokens = lex('2 - 1/2')
			verify(tokens).areTokensWithTypes([
				'Number',
				'Minus',
				'Number',
				'Slash',
				'Number',
			])
		})

		it(`converts '(7 * 91) + -8'`, () => {
			const tokens = lex('(7 * 91) + -8')
			verify(tokens).areTokensWithTypes([
				'LParen',
				'Number',
				'Star',
				'Number',
				'RParen',
				'Plus',
				'Minus',
				'Number',
			])
		})

		it(`converts '-5 * -(1  + 2)/ 3 '`, () => {
			const tokens = lex('-5 * -(1  + 2)/ 3 ')
			verify(tokens).areTokensWithTypes([
				'Minus',
				'Number',
				'Star',
				'Minus',
				'LParen',
				'Number',
				'Plus',
				'Number',
				'RParen',
				'Slash',
				'Number',
			])
		})

		it('throws an error on invalid input', () => {
			const lexBad = () => lex('1 + ,2')
			expect(lexBad).to.throw()
		})

	})

})

module.exports = {
	verify,
}
