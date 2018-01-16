'use strict'; // eslint-disable-line semi
/* eslint-disable new-cap */

// a utility library for building Sum Types in JS
const daggy = require('daggy')

const { inspect } = require('util')
const { Token, lex } = require('./lexer')

const ParseTree = daggy.taggedSum('ParseTree', {
	Natural: ['value'],
	Factor: ['child', 'negate'],
	F2: ['op', 'factor', 'childF2'],
	T2: ['op', 'term', 'childT2'],
	Term: ['factor', 'childF2'],
	Expression: ['term', 'childT2'],
})

// All the sub-parsers take a List of Tokens, and return a tuple of a parse
// tree + the nodes which the parser did not consume.

// parseNatural :: List<Token> -> { PT, List<Token> }
const parseNatural = tokens => tokens.first().cata({
	// Natural (a terminal symbol)
	Number: value => ({
		PT: ParseTree.Natural(value), // build a tree node
		tokens: tokens.rest() // and consume one token
	})
})

// parseFactor :: List<Token> -> { PT, List<Token> }
const parseFactor = tokens => {

	const next = tokens.first()

	// F -> (E)
	// F -> -F
	// F -> Natural

	const isNum = Token.Number.is(next)
	const isExpr = Token.Lparen.is(next)
	const isNeg = Token.Sub.is(next)
	const parseNext = next.cata({ // determine which parser to use
		// eslint-disable-next-line no-use-before-define
		Lparen: () => parseExpression,
		Number: () => parseNatural,
		Sub: () => parseFactor,
	})

	// if not Number, skip initial Sub or Lparen
	const result = parseNext(isNum ? tokens : tokens.rest())

	// checking that parenthetical expressions end in Rparen
	if (isExpr && !Token.Rparen.is(result.tokens.first())) {
		throw Error(`Unexpected token: ${result.tokens.first()}`)
	}

	return {
		PT: ParseTree.Factor(
			result.PT,
			isNeg
		),
		tokens: isExpr
			? result.tokens.rest() // remove Rparen
			: result.tokens
	}
}

// parseB :: List<Token> -> { PT, List<Token> }
const parseF2 = tokens => {

	const next = tokens.first()

	// F2 -> epsilon
	const isMul = Token.Mul.is(next)
	const isDiv = Token.Div.is(next)
	if (!isMul && !isDiv) {
		return {
			PT: null,
			tokens
		}
	}

	// F2 -> * F F2 | / F F2
	const op = next
	const factorResult = parseFactor(tokens.rest())
	const f2Result = parseF2(factorResult.tokens)
	return {
		PT: ParseTree.F2(
			op,
			factorResult.PT,
			f2Result.PT
		),
		tokens: f2Result.tokens
	}
}

// parseTerm :: List<Token> -> { PT, List<Token> }
const parseTerm = tokens => {
	// T -> F F2
	const factorResult = parseFactor(tokens)
	const f2Result = parseF2(factorResult.tokens)
	return {
		PT: ParseTree.Term(
			factorResult.PT,
			f2Result.PT
		),
		tokens: f2Result.tokens
	}
}

// parseA :: List<Token> -> { PT, List<Token> }
const parseT2 = tokens => {

	const next = tokens.first()

	// T2 -> epsilon
	const isAdd = Token.Add.is(next)
	const isSub = Token.Sub.is(next)
	if (!isAdd && !isSub) {
		return {
			PT: null,
			tokens
		}
	}

	// T2 -> + T T2 | - T T2
	const op = next
	const termResult = parseTerm(tokens.rest())
	const t2Result = parseT2(termResult.tokens)
	return {
		PT: ParseTree.T2(
			op,
			termResult.PT,
			t2Result.PT
		),
		tokens: t2Result.tokens
	}
}

// parseExpression :: List<Token> -> { PT, List<Token> }
const parseExpression = tokens => {
	// E -> T T2
	const termResult = parseTerm(tokens)
	const t2Result = parseT2(termResult.tokens)
	return {
		PT: ParseTree.Expression(
			termResult.PT,
			t2Result.PT
		),
		tokens: t2Result.tokens
	}
}

// parse :: List<Token> -> ParseTree
const parse = tokens => parseExpression(tokens).PT

const debugParseTree = expressionStr => {
	console.log(inspect(
		parse(lex(expressionStr)),
		{ depth: null, colors: true, customInspect: true }
	))
}

// debugParseTree('1')
// debugParseTree('4 + (3 / 2) * (1 - 77 + -3)')

module.exports = {
	ParseTree,
	parse,
	parseNatural,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
}
