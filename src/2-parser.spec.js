'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const { expect } = chai

const { lex } = require('./1-lexer')
const { verify } = require('./1-lexer.spec')
const {
	parse,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
} = require('./2-parser')

// helper function
const verifyResultShape = result => {
	expect(result).to.be.an('object')
	expect(result.PT).to.be.an('object')
	expect(result.remainingTokens).to.be.an('array')
}

describe.only('parser', () => {

	describe('helpers', () => {

		describe('`parseFactor`', () => {

			describe(`parsing '27'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('27')
					result = parseFactor(tokens)
				})

				// PT here stands for "Parse Tree"
				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `NumericF` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'NumericF',
						childNumber: '27',
					})
				})

				it('consumes one token, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(1)
				})

			})

			describe(`parsing '32 + 4'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('32 + 4')
					result = parseFactor(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `NumericF` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'NumericF',
						childNumber: '32',
					})
				})

				it('consumes one token, leaving two remaining tokens', () => {
					verify(result.remainingTokens).areTokensWithTypes([
						'Plus',
						'Number',
					])
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(3)
				})

			})

			describe(`parsing '-7'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('-7')
					result = parseFactor(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `NegativeF` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'NegativeF',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '7',
						},
					})
				})

				it('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '-93 * (12)'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('-93 * (12)')
					result = parseFactor(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `NegativeF` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'NegativeF',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '93',
						},
					})
				})

				it('consumes two tokens, leaving four remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(4)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(6)
				})

			})

			describe(`parsing '/45'`, () => {

				const bad = () => parseFactor('/45')

				it('throws an error', () => {
					expect(bad).to.throw
				})

			})

		})

		describe('`parseF2`', () => {

			describe(`parsing ''`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds an `EpsilonF2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonF2',
					})
				})

				it('consumes zero tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(0)
				})

			})

			describe(`parsing '+ 45 / 9'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('+ 45 / 9')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds an `EpsilonF2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonF2',
					})
				})

				it('consumes zero tokens, leaving four remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(4)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '* 13'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* 13')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `MultiplicativeF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'MultiplicativeF2',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '13',
						},
						// remember recursion?
						childF2: {
							type: 'EpsilonF2',
						},
					})
				})

				it('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '* 9 - 762'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* 9 - 762')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `MultiplicativeF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'MultiplicativeF2',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '9',
						},
						// remember recursion?
						childF2: {
							type: 'EpsilonF2',
						},
					})
				})

				it('consumes two tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '* 1 * 6 * 2 + -5'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* 1 * 6 * 2 + -5')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `MultiplicativeF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'MultiplicativeF2',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '1',
						},
						// remember recursion?
						childF2: {
							type: 'MultiplicativeF2',
							// oh boy, recursion
							childFactor: {
								type: 'NumericF',
								childNumber: '6',
							},
							// yup, it's recursive
							childF2: {
								type: 'MultiplicativeF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '2',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
					})
				})

				it('consumes six tokens, leaving three remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(3)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(9)
				})

			})

			describe(`parsing '/ 13'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 13')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `DivisionalF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'DivisionalF2',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '13',
						},
						// remember recursion?
						childF2: {
							type: 'EpsilonF2',
						},
					})
				})

				it('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '/ 9 - 762'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 9 - 762')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `DivisionalF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'DivisionalF2',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '9',
						},
						// remember recursion?
						childF2: {
							type: 'EpsilonF2',
						},
					})
				})

				it('consumes two tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '/ 1 / 6 / 2 + -5'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 1 / 6 / 2 + -5')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `DivisionalF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'DivisionalF2',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '1',
						},
						// remember recursion?
						childF2: {
							type: 'DivisionalF2',
							// oh boy, recursion
							childFactor: {
								type: 'NumericF',
								childNumber: '6',
							},
							// yup, it's recursive
							childF2: {
								type: 'DivisionalF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '2',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
					})
				})

				it('consumes six tokens, leaving three remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(3)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(9)
				})

			})

			describe(`parsing '* -8 / 3 - 0'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* -8 / 3 - 0')
					result = parseF2(tokens)
				})

				it('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				it('builds a `MultiplicativeF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'MultiplicativeF2',
						childFactor: {
							type: 'NegativeF',
							childFactor: {
								type: 'NumericF',
								childNumber: '8',
							},
						},
						childF2: {
							type: 'DivisionalF2',
							childFactor: {
								type: 'NumericF',
								childNumber: '3',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
					})
				})

				it('consumes five tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				it('does not modify the original tokens', () => {
					expect(tokens).to.have.length(7)
				})

			})

		})

		xdescribe('`parseTerm`', () => {
			// todo
		})

		xdescribe('`parseT2`', () => {
			// todo
		})

		xdescribe('`parseExpression`', () => {
			// todo
		})

	})

	describe('`parse`', () => {

		it('is a function', () => {
			expect(parse).to.be.a('function')
		})

		xit('builds a parse tree for a number', () => {
			// TODO
		})

	})

})
