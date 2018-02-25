'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const { expect } = chai

const { lex } = require('./1-lexer')
const { parse } = require('./2-parser')
const frontend = expressionStr => parse(lex(expressionStr))

const { evaluate, rpn, original } = require('./3-generator')

describe('generator', () => {

	describe('evaluate', () => {

		it('is a function', () => {
			expect(evaluate).to.be.a('function')
		})

		it('evaluates `1`', () => {
			const tree = frontend('1')
			expect(evaluate(tree)).to.equal(1)
		})

		it('evaluates `-1`', () => {
			const tree = frontend('-1')
			expect(evaluate(tree)).to.equal(-1)
		})

		it('evaluates `1 + 2`', () => {
			const tree = frontend('1 + 2')
			expect(evaluate(tree)).to.equal(3)
		})

		it('evaluates `3 - 5`', () => {
			const tree = frontend('3 - 5')
			expect(evaluate(tree)).to.equal(-2)
		})

		it('evaluates `3 + -5 - 4 - -12`', () => {
			const tree = frontend('3 + -5 - 4 - -12')
			expect(evaluate(tree)).to.equal(6)
		})

		it('evaluates `4 * 3`', () => {
			const tree = frontend('4 * 3')
			expect(evaluate(tree)).to.equal(12)
		})

		it('evaluates `3 / 4`', () => {
			const tree = frontend('3 / 4')
			expect(evaluate(tree)).to.equal(0.75)
		})

		it('evaluates `3 * 6 / 2 * 5`', () => {
			const tree = frontend('3 * 6 / 2 * 5')
			expect(evaluate(tree)).to.equal(45)
		})

		it('evaluates `-3 * -6 / -2 * 5`', () => {
			const tree = frontend('-3 * -6 / -2 * 5')
			expect(evaluate(tree)).to.equal(-45)
		})

		it('evaluates `(4)`', () => {
			const tree = frontend('(4)')
			expect(evaluate(tree)).to.equal(4)
		})

		it('evaluates `(-4)`', () => {
			const tree = frontend('(-4)')
			expect(evaluate(tree)).to.equal(-4)
		})

		it('evaluates `-(4)`', () => {
			const tree = frontend('-(4)')
			expect(evaluate(tree)).to.equal(-4)
		})

		it('evaluates `-(-4 + 9)`', () => {
			const tree = frontend('-(-4 + 9)')
			expect(evaluate(tree)).to.equal(-5)
		})

		it('evaluates `-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)`', () => {
			const tree = frontend('-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)')
			expect(evaluate(tree)).to.equal(20.8)
		})

	})

	describe('rpn', () => {

		it('is a function', () => {
			expect(rpn).to.be.a('function')
		})

		it('compiles `1` to `1`', () => {
			const tree = frontend('1')
			expect(rpn(tree)).to.equal('1')
		})

		it('compiles `1 + 2` to `1 2 +`', () => {
			const tree = frontend('1 + 2')
			expect(rpn(tree)).to.equal('1 2 +')
		})

		it('compiles `-3` to `3 -1 *`', () => {
			const tree = frontend('-3')
			expect(rpn(tree)).to.equal('3 -1 *')
		})

		it('compiles `(1)` to `1`', () => {
			const tree = frontend('(1)')
			expect(rpn(tree)).to.equal('1')
		})

		it('compiles `-(2 + 4)` to `2 4 + -1 *`', () => {
			const tree = frontend('-(2 + 4)')
			expect(rpn(tree)).to.equal('2 4 + -1 *')
		})

		it('compiles `4 * 3 / 1 + 2 / 8` to `4 3 * 1 / 2 8 / +`', () => {
			const tree = frontend('4 * 3 / 1 + 2 / 8')
			expect(rpn(tree)).to.equal('4 3 * 1 / 2 8 / +')
		})

		it('compiles `-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)` properly', () => {
			const tree = frontend('-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)')
			expect(rpn(tree)).to.equal('9 -1 * 2 * 3 7 + -1 * / 4 -1 * 1 * 2 / 21 -1 * - +')
		})

	})

	describe('original', () => {

		it('is a function', () => {
			expect(original).to.be.a('function')
		})

		const examples = [
			'1',
			'1 + 2',
			'-3',
			'(1)',
			'-(2 + 4)',
			'4 * 3 / 1 + 2 / 8',
			'-9 * 2 / -(3 + 7) + ((-4 * 1 / 2) - -21)',
		]

		examples.forEach(example => it(
			`compiles \`${example}\` back to itself`, () => {
				const tree = frontend(example)
				expect(original(tree)).to.equal(example)
			}
		))

		it('improves the whitepsace for `  4*     3   /1`', () => {
			expect(original(frontend('  4*     3   /1'))).to.equal('4 * 3 / 1')
		})

	})

})
