'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const { expect } = chai

const { lex } = require('./1-lexer')
const { parse } = require('./2-parser')
const frontend = expressionStr => parse(lex(expressionStr))

const { evaluate, rpn, original } = require('./3-generator')

describe('generator', () => {

	describe('original', () => {

		xit('when given a NumericF parse tree, returns the number string', () => {
			const tree = {
				type: 'NumericF',
				childNumber: '1',
			}
			const string = original(tree)
			expect(string).to.equal('1')
		})

		xit('when given a NegativeF parse tree, returns the negated number string', () => {
			const tree = {
				type: 'NegativeF',
				// hint: use recursion…
				childFactor: {
					type: 'NumericF',
					childNumber: '5',
				},
			}
			const string = original(tree)
			expect(string).to.equal('-5')
		})

		xit('when given an EpsilonF2 parse tree, returns the string equivalent of "nothing"', () => {
			const tree = {
				type: 'EpsilonF2',
			}
			const string = original(tree)
			expect(string).to.be.empty
		})

		xit('when given a MultiplicativeF2 parse tree, returns original right-hand side of the multiplication', () => {
			const tree = {
				type: 'MultiplicativeF2',
				childFactor: {
					type: 'NegativeF',
					childFactor: {
						type: 'NumericF',
						childNumber: '38',
					},
				},
				childF2: {
					type: 'EpsilonF2',
				},
			}
			const string = original(tree)
			expect(string).to.equal(' * -38')
		})

		xit('when given a DivisionalF2 parse tree, returns original right-hand side of the division', () => {
			const tree = {
				type: 'DivisionalF2',
				childFactor: {
					type: 'NumericF',
					childNumber: '3',
				},
				childF2: {
					type: 'MultiplicativeF2',
					childFactor: {
						type: 'NumericF',
						childNumber: '17',
					},
					childF2: {
						type: 'EpsilonF2',
					},
				},
			}
			const string = original(tree)
			expect(string).to.equal(' / 3 * 17')
		})

		// OK, no more handholding… try to fill in every parse tree node type, then run these tests. Remember that the top node of our parse tree will always be an Expression.

		const examples = [
			'1',
			'1 + 2',
			'-3',
			'4 * 3 / 1 + 2 / 8',
			'(1)',
			'-(2 + 4)',
			'-9 * 2 / -(3 + 7) + ((-4 * 1 / 2) - -21)',
		]

		examples.forEach(example => {
			xit(`compiles '${example}' to the same string`, () => {
				const tree = frontend(example)
				expect(original(tree)).to.equal(example)
			})
		})

		xit(`improves the spacing for '  4*     3   /1'`, () => {
			expect(original(frontend('  4*     3   /1'))).to.equal('4 * 3 / 1')
		})

	})

	describe('evaluate', () => {

		xit('evaluates `1`', () => {
			const tree = frontend('1')
			expect(evaluate(tree)).to.equal(1)
		})

		xit('evaluates `-1`', () => {
			const tree = frontend('-1')
			expect(evaluate(tree)).to.equal(-1)
		})

		xit('evaluates `1 + 2`', () => {
			const tree = frontend('1 + 2')
			expect(evaluate(tree)).to.equal(3)
		})

		xit('evaluates `3 - 5`', () => {
			const tree = frontend('3 - 5')
			expect(evaluate(tree)).to.equal(-2)
		})

		xit('evaluates `3 + -5 - 4 - -12`', () => {
			const tree = frontend('3 + -5 - 4 - -12')
			expect(evaluate(tree)).to.equal(6)
		})

		xit('evaluates `4 * 3`', () => {
			const tree = frontend('4 * 3')
			expect(evaluate(tree)).to.equal(12)
		})

		xit('evaluates `3 / 4`', () => {
			const tree = frontend('3 / 4')
			expect(evaluate(tree)).to.equal(0.75)
		})

		xit('evaluates `3 * 6 / 2 * 5`', () => {
			const tree = frontend('3 * 6 / 2 * 5')
			expect(evaluate(tree)).to.equal(45)
		})

		xit('evaluates `-3 * -6 / -2 * 5`', () => {
			const tree = frontend('-3 * -6 / -2 * 5')
			expect(evaluate(tree)).to.equal(-45)
		})

		xit('evaluates `(4)`', () => {
			const tree = frontend('(4)')
			expect(evaluate(tree)).to.equal(4)
		})

		xit('evaluates `(-4)`', () => {
			const tree = frontend('(-4)')
			expect(evaluate(tree)).to.equal(-4)
		})

		xit('evaluates `-(4)`', () => {
			const tree = frontend('-(4)')
			expect(evaluate(tree)).to.equal(-4)
		})

		xit('evaluates `-(-4 + 9)`', () => {
			const tree = frontend('-(-4 + 9)')
			expect(evaluate(tree)).to.equal(-5)
		})

		xit('evaluates `-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)`', () => {
			const tree = frontend('-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)')
			expect(evaluate(tree)).to.equal(20.8)
		})

	})

	describe('rpn', () => {

		xit('is a function', () => {
			expect(rpn).to.be.a('function')
		})

		xit('compiles `1` to `1`', () => {
			const tree = frontend('1')
			expect(rpn(tree)).to.equal('1')
		})

		xit('compiles `1 + 2` to `1 2 +`', () => {
			const tree = frontend('1 + 2')
			expect(rpn(tree)).to.equal('1 2 +')
		})

		xit('compiles `-3` to `3 -1 *`', () => {
			const tree = frontend('-3')
			expect(rpn(tree)).to.equal('3 -1 *')
		})

		xit('compiles `(1)` to `1`', () => {
			const tree = frontend('(1)')
			expect(rpn(tree)).to.equal('1')
		})

		xit('compiles `-(2 + 4)` to `2 4 + -1 *`', () => {
			const tree = frontend('-(2 + 4)')
			expect(rpn(tree)).to.equal('2 4 + -1 *')
		})

		xit('compiles `4 * 3 / 1 + 2 / 8` to `4 3 * 1 / 2 8 / +`', () => {
			const tree = frontend('4 * 3 / 1 + 2 / 8')
			expect(rpn(tree)).to.equal('4 3 * 1 / 2 8 / +')
		})

		xit('compiles `-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)` properly', () => {
			const tree = frontend('-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)')
			expect(rpn(tree)).to.equal('9 -1 * 2 * 3 7 + -1 * / 4 -1 * 1 * 2 / 21 -1 * - +')
		})

	})

})
