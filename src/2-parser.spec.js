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

describe('parser', () => {

	describe('helpers', () => {

		describe('`parseFactor`', () => {

			describe(`parsing '27'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('27')
					result = parseFactor(tokens)
				})

				// PT here stands for "Parse Tree"
				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `NumericF` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'NumericF',
						childNumber: '27',
					})
				})

				xit('consumes one token, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(1)
				})

			})

			describe(`parsing '32 + 4'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('32 + 4')
					result = parseFactor(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `NumericF` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'NumericF',
						childNumber: '32',
					})
				})

				xit('consumes one token, leaving two remaining tokens', () => {
					verify(result.remainingTokens).areTokensWithTypes([
						'Plus',
						'Number',
					])
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(3)
				})

			})

			describe(`parsing '-7'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('-7')
					result = parseFactor(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `NegativeF` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'NegativeF',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '7',
						},
					})
				})

				xit('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '-93 * (12)'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('-93 * (12)')
					result = parseFactor(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `NegativeF` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'NegativeF',
						// hint: use recursion!
						childFactor: {
							type: 'NumericF',
							childNumber: '93',
						},
					})
				})

				xit('consumes two tokens, leaving four remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(4)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(6)
				})

			})

			describe(`parsing '/45'`, () => {

				const bad = () => parseFactor('/45')

				xit('throws an error', () => {
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

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `EpsilonF2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonF2',
					})
				})

				xit('consumes zero tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(0)
				})

			})

			describe(`parsing '+ 45 / 9'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('+ 45 / 9')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `EpsilonF2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonF2',
					})
				})

				xit('consumes zero tokens, leaving four remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(4)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '* 13'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* 13')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `MultiplicativeF2` parse tree', () => {
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

				xit('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '* 9 - 762'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* 9 - 762')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `MultiplicativeF2` parse tree', () => {
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

				xit('consumes two tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '* 1 * 6 * 2 + -5'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* 1 * 6 * 2 + -5')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `MultiplicativeF2` parse tree', () => {
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
							// yup, that's recursive
							childF2: {
								type: 'MultiplicativeF2',
								// very recursive
								childFactor: {
									type: 'NumericF',
									childNumber: '2',
								},
								// recurse ALL the way
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
					})
				})

				xit('consumes six tokens, leaving three remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(3)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(9)
				})

			})

			describe(`parsing '/ 13'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 13')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `DivisionalF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'DivisionalF2',
						childFactor: {
							type: 'NumericF',
							childNumber: '13',
						},
						childF2: {
							type: 'EpsilonF2',
						},
					})
				})

				xit('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '/ 9 - 762'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 9 - 762')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `DivisionalF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'DivisionalF2',
						childFactor: {
							type: 'NumericF',
							childNumber: '9',
						},
						childF2: {
							type: 'EpsilonF2',
						},
					})
				})

				xit('consumes two tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '/ 1 / 6 / 2 + -5'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 1 / 6 / 2 + -5')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `DivisionalF2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'DivisionalF2',
						childFactor: {
							type: 'NumericF',
							childNumber: '1',
						},
						childF2: {
							type: 'DivisionalF2',
							childFactor: {
								type: 'NumericF',
								childNumber: '6',
							},
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

				xit('consumes six tokens, leaving three remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(3)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(9)
				})

			})

			describe(`parsing '* -8 / 3 - 0'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('* -8 / 3 - 0')
					result = parseF2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `MultiplicativeF2` parse tree', () => {
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

				xit('consumes five tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(7)
				})

			})

		})

		describe('`parseTerm`', () => {

			describe(`parsing '3 * 5'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('3 * 5')
					result = parseTerm(tokens)
				})

				// PT here stands for "Parse Tree"
				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `Term` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'Term',
						childFactor: {
							type: 'NumericF',
							childNumber: '3',
						},
						childF2: {
							type: 'MultiplicativeF2',
							childFactor: {
								type: 'NumericF',
								childNumber: '5',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
					})
				})

				xit('consumes three tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(3)
				})

			})

			describe(`parsing '12 / 4'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('12 / 4')
					result = parseTerm(tokens)
				})

				// PT here stands for "Parse Tree"
				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `Term` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'Term',
						childFactor: {
							type: 'NumericF',
							childNumber: '12',
						},
						childF2: {
							type: 'DivisionalF2',
							childFactor: {
								type: 'NumericF',
								childNumber: '4',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
					})
				})

				xit('consumes three tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(3)
				})

			})

			describe(`parsing '-99 * 1/2 + -76'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('-99 * 1/2 + -76')
					result = parseTerm(tokens)
				})

				// PT here stands for "Parse Tree"
				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `Term` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'Term',
						childFactor: {
							type: 'NegativeF',
							childFactor: {
								type: 'NumericF',
								childNumber: '99',
							},
						},
						childF2: {
							type: 'MultiplicativeF2',
							childFactor: {
								type: 'NumericF',
								childNumber: '1',
							},
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

				xit('consumes six tokens, leaving three remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(3)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(9)
				})

			})

		})

		describe('`parseT2`', () => {

			describe(`parsing ''`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `EpsilonT2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonT2',
					})
				})

				xit('consumes zero tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(0)
				})

			})

			describe(`parsing ') + (9)'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex(') + (9)')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `EpsilonT2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonT2',
					})
				})

				xit('consumes zero tokens, leaving five remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(5)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(5)
				})

			})

			describe(`parsing '/ 45 + 9'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('/ 45 + 9')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `EpsilonT2` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'EpsilonT2',
					})
				})

				xit('consumes zero tokens, leaving four remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(4)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '+ 13'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('+ 13')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `AdditiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'AdditiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '13',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
						childT2: {
							type: 'EpsilonT2',
						},
					})
				})

				xit('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '+ 3/4'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('+ 3/4')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `AdditiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'AdditiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '3',
							},
							childF2: {
								type: 'DivisionalF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '4',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
						childT2: {
							type: 'EpsilonT2',
						},
					})
				})

				xit('consumes four tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '+ 8 + 2'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('+ 8 + 2')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `AdditiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'AdditiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '8',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
						childT2: {
							type: 'AdditiveT2',
							childTerm: {
								type: 'Term',
								childFactor: {
									type: 'NumericF',
									childNumber: '2',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
							childT2: {
								type: 'EpsilonT2',
							},
						},
					})
				})

				xit('consumes four tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '- 13'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('- 13')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `SubtractiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'SubtractiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '13',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
						childT2: {
							type: 'EpsilonT2',
						},
					})
				})

				xit('consumes two tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(2)
				})

			})

			describe(`parsing '- 3/4'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('- 3/4')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `SubtractiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'SubtractiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '3',
							},
							childF2: {
								type: 'DivisionalF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '4',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
						childT2: {
							type: 'EpsilonT2',
						},
					})
				})

				xit('consumes four tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '- 8 - 2'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('- 8 - 2')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `SubtractiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'SubtractiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '8',
							},
							childF2: {
								type: 'EpsilonF2',
							},
						},
						childT2: {
							type: 'SubtractiveT2',
							childTerm: {
								type: 'Term',
								childFactor: {
									type: 'NumericF',
									childNumber: '2',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
							childT2: {
								type: 'EpsilonT2',
							},
						},
					})
				})

				xit('consumes four tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(4)
				})

			})

			describe(`parsing '+ 1/64 - 5 * 4'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('+ 1/64 - 5 * 4')
					result = parseT2(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `AdditiveT2` parse tree', () => {
					expect(result.PT).to.deep.equal({
						type: 'AdditiveT2',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '1',
							},
							childF2: {
								type: 'DivisionalF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '64',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
						childT2: {
							type: 'SubtractiveT2',
							childTerm: {
								type: 'Term',
								childFactor: {
									type: 'NumericF',
									childNumber: '5',
								},
								childF2: {
									type: 'MultiplicativeF2',
									childFactor: {
										type: 'NumericF',
										childNumber: '4',
									},
									childF2: {
										type: 'EpsilonF2',
									},
								},
							},
							childT2: {
								type: 'EpsilonT2',
							},
						},
					})
				})

				xit('consumes eight tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(8)
				})

			})

		})

		describe('`parseExpression`', () => {

			describe(`parsing '3 * 5'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('3 * 5')
					result = parseExpression(tokens)
				})

				// PT here stands for "Parse Tree"
				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `Expression` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'Expression',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '3',
							},
							childF2: {
								type: 'MultiplicativeF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '5',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
						childT2: {
							type: 'EpsilonT2',
						},
					})
				})

				xit('consumes three tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(3)
				})

			})

			describe(`parsing '3 * 5 + 1'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('3 * 5 + 1')
					result = parseExpression(tokens)
				})

				// PT here stands for "Parse Tree"
				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds an `Expression` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'Expression',
						childTerm: {
							type: 'Term',
							childFactor: {
								type: 'NumericF',
								childNumber: '3',
							},
							childF2: {
								type: 'MultiplicativeF2',
								childFactor: {
									type: 'NumericF',
									childNumber: '5',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
						},
						childT2: {
							type: 'AdditiveT2',
							childTerm: {
								type: 'Term',
								childFactor: {
									type: 'NumericF',
									childNumber: '1',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
							childT2: {
								type: 'EpsilonT2',
							},
						},
					})
				})

				xit('consumes five tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(5)
				})

			})

		})

		describe('`parseFactor` (again)', () => {

			describe(`parsing '(27)'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('(27)')
					result = parseFactor(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `GroupF` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'GroupF',
						childExpression: {
							type: 'Expression',
							childTerm: {
								type: 'Term',
								childFactor: {
									type: 'NumericF',
									childNumber: '27',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
							childT2: {
								type: 'EpsilonT2',
							},
						},
					})
				})

				xit('consumes three tokens, leaving zero remaining tokens', () => {
					expect(result.remainingTokens).to.be.empty
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(3)
				})

			})

			describe(`parsing '(27) + 9'`, () => {

				let result, tokens
				beforeEach(() => {
					tokens = lex('(27) + 9')
					result = parseFactor(tokens)
				})

				xit('returns an object with `PT` object and `remainingTokens` array properties', () => {
					verifyResultShape(result)
				})

				xit('builds a `GroupF` parse tree node', () => {
					expect(result.PT).to.deep.equal({
						type: 'GroupF',
						childExpression: {
							type: 'Expression',
							childTerm: {
								type: 'Term',
								childFactor: {
									type: 'NumericF',
									childNumber: '27',
								},
								childF2: {
									type: 'EpsilonF2',
								},
							},
							childT2: {
								type: 'EpsilonT2',
							},
						},
					})
				})

				xit('consumes three tokens, leaving two remaining tokens', () => {
					expect(result.remainingTokens).to.have.length(2)
				})

				xit('does not modify the original tokens', () => {
					expect(tokens).to.have.length(5)
				})

			})

		})

	})

	describe('`parse`', () => {

		xit('returns a parse tree for an expression from an array of input tokens', () => {
			const tokens = lex('-3 / (4 - 2 * 2) + 1')
			const tree = parse(tokens)
			expect(tree).to.deep.equal({
				type: 'Expression',
				childTerm: {
					type: 'Term',
					childFactor: {
						type: 'NegativeF',
						childFactor: {
							type: 'NumericF',
							childNumber: '3',
						},
					},
					childF2: {
						type: 'DivisionalF2',
						childFactor: {
							type: 'GroupF',
							childExpression: {
								type: 'Expression',
								childTerm: {
									type: 'Term',
									childFactor: {
										type: 'NumericF',
										childNumber: '4',
									},
									childF2: {
										type: 'EpsilonF2',
									},
								},
								childT2: {
									type: 'SubtractiveT2',
									childTerm: {
										type: 'Term',
										childFactor: {
											type: 'NumericF',
											childNumber: '2',
										},
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
									childT2: {
										type: 'EpsilonT2',
									},
								},
							},
						},
						childF2: {
							type: 'EpsilonF2',
						},
					},
				},
				childT2: {
					type: 'AdditiveT2',
					childTerm: {
						type: 'Term',
						childFactor: {
							type: 'NumericF',
							childNumber: '1',
						},
						childF2: {
							type: 'EpsilonF2',
						},
					},
					childT2: {
						type: 'EpsilonT2',
					},
				},
			})
		})

	})

})
