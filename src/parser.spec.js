'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const { List } = require('immutable')
const chai = require('chai')
const chaiImmutable = require('chai-immutable')
const { expect } = chai
chai.use(chaiImmutable)

const { Token, lex } = require('./lexer')
const {
	ParseTree,
	parse,
	parseNatural,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
} = require('./parser')

describe('parsing functions:', () => {

	describe('parseNatural', () => {

		it('converts number token to natural node', () => {
			const { PT } = parseNatural(lex('342'))
			expect(ParseTree.Natural.is(PT)).to.be.true
		})

		it('natural node captures number token value', () => {
			const { PT } = parseNatural(lex('342'))
			expect(PT).to.be.an('object')
			expect(PT).to.have.property('value')
			expect(PT.value).to.equal('342')
		})

		it('consumes one token and returns the remainder', () => {
			const tokens = lex('342')
			expect(tokens).to.have.size(1)
			const { tokens: remainder } = parseNatural(tokens)
			expect(List.isList(remainder)).to.be.true
			expect(remainder).to.have.size(0)
		})

		it('throws when given an incorrect token', () => {
			const badParse = () => parseNatural(lex('-'))
			expect(badParse).to.throw()
		})

	})

	xdescribe('parseFactor', () => {
		// TODO
	})

	xdescribe('parseF2', () => {
		// todo
	})

	xdescribe('parseTerm', () => {
		// todo
	})

	xdescribe('parseT2', () => {
		// todo
	})

	xdescribe('parseExpression', () => {
		// todo
	})

})

describe('parse', () => {

	it('is a function', () => {
		expect(parse).to.be.a('function')
	})

	xit('builds a parse tree for a number', () => {
		// todo
	})

})
