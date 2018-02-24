'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiImmutable = require('chai-immutable')
const { expect } = chai
chai.use(chaiImmutable)

const { Token, lex } = require('./1-lexer')

describe('Token', () => {

	it('is an object', () => {
		expect(Token).to.be.an('object')
	})

	describe('`Number`', () => {

		it('is a function', () => {
			expect(Token.Number).to.be.a('function')
		})

		it('requires an argument', () => {
			const makeEmptyNumber = () => Token.Number()
			expect(makeEmptyNumber).to.throw(/argument/)
		})

		it('stores its argument as `.value`', () => {
			const number5 = Token.Number('5')
			expect(number5.value).to.equal('5')
			const number9 = Token.Number('9')
			expect(number9.value).to.equal('9')
		})

		it('can be confirmed as a `Number`', () => {
			const num = Token.Number(Math.random())
			expect(Token.Number.is(num)).to.be.true
		})

		it('can be confirmed as a `Token`', () => {
			const num = Token.Number(Math.random())
			expect(Token.is(num)).to.be.true
		})

		it('does not confirm non-`Number`s', () => {
			expect(Token.Number.is({})).to.be.false
		})

	})

	describe('non-parameterized types', () => {

		const typeNames = [
			'Lparen',
			'Rparen',
			'Mul',
			'Div',
			'Add',
			'Sub',
		]

		typeNames.forEach(typeName => {

			describe(typeName, () => {

				let type
				beforeEach(() => {
					type = Token[typeName]
				})

				it('is an object', () => {
					expect(type).to.be.an('object')
				})

				it(`can be confirmed as a ${typeName}`, () => {
					expect(Token[typeName].is(type)).to.be.true
				})

				it('can be confirmed as a `Token`', () => {
					expect(Token.is(type)).to.be.true
				})

				it(`does not confirm non-${typeName}s`, () => {
					expect(Token.Number.is({})).to.be.false
				})

			})

		})

	})

})

describe('`lex`', () => {

	/* eslint-disable no-unused-expressions */

	const allTokens = maybeTokens =>
		maybeTokens.every(Token.is.bind(Token))

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
		expect(Token.Number.is(tokens[0])).to.be.true
	})

	it(`converts '1+2' to proper tokens]`, () => {
		const tokens = lex('1+2')
		expect(tokens).to.have.length(3)
		expect(allTokens(tokens)).to.be.true
		expect(Token.Number.is(tokens[0])).to.be.true
		expect(Token.Add.is(tokens[1])).to.be.true
		expect(Token.Number.is(tokens[2])).to.be.true
	})

	it(`converts '1 + 2', ignoring whitespace`, () => {
		const tokens = lex('1+2')
		expect(tokens).to.have.length(3)
		expect(allTokens(tokens)).to.be.true
		expect(Token.Number.is(tokens[0])).to.be.true
		expect(Token.Add.is(tokens[1])).to.be.true
		expect(Token.Number.is(tokens[2])).to.be.true
	})

	it(`converts '-5 * (1  + 2)/ 3 '`, () => {
		const tokens = lex('-5 * (1  + 2)/ 3 ')
		expect(tokens).to.have.length(10)
		expect(allTokens(tokens)).to.be.true
		const expectedTypes = [
			'Sub',
			'Number',
			'Mul',
			'Lparen',
			'Number',
			'Add',
			'Number',
			'Rparen',
			'Div',
			'Number',
		]
		expectedTypes.forEach((name, idx) =>
			expect(Token[name].is(tokens[idx])).to.be.true
		)
	})

	it('throws an error on invalid input', () => {
		const lexBad = () => lex('1 + ,2')
		expect(lexBad).to.throw()
	})

})
