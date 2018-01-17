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
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
	parseSign,
} = require('./parser')

describe('parser', () => {

	describe('token parsing functions:', () => {

		xdescribe('parseSign', () => {
			// TODO
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
			// TODO
		})

	})

})
