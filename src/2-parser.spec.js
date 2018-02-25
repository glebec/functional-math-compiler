'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const { expect } = chai

const { Token, lex } = require('./1-lexer')
const {
	ParseTree,
	parse,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
	parseSign,
} = require('./2-parser')

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
