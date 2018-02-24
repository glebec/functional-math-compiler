'use strict'; // eslint-disable-line semi
/* eslint-disable new-cap */

// a utility library for building Sum Types in JS
const daggy = require('daggy')

const { Token } = require('./1-lexer')

const ParseTree = daggy.taggedSum('ParseTree', {
	Factor: ['sign', 'child'],
	F2: ['op', 'factor', 'childF2'],
	T2: ['op', 'term', 'childT2'],
	Term: ['factor', 'childF2'],
	Expression: ['term', 'childT2'],
	EpsilonF: [], // multiplicative identity
	EpsilonT: [], // additive identity
})

// All the sub-parsers take a List of Tokens, and return a tuple of
// (a token or parse tree) and (the tokens which the parser did not consume).

// parseSign :: List<Token> -> { PT, List<Token> }
const parseSign = tokens => {

	const next = tokens[0]

	// S -> -
	if (Token.Sub.is(next)) {
		return {
			PT: next, // tree nodes can be tokens
			tokens: tokens.slice(1), // one token is consumed
		}
	}

	// S -> epsilon
	return {
		PT: ParseTree.EpsilonF, // multiplicative identity
		tokens, // no tokens were consumed
	}
}

// parseFactor :: List<Token> -> { PT, List<Token> }
const parseFactor = tokens => {

	const next = tokens[0]

	// F -> Number
	if (Token.Number.is(next)) {
		return {
			PT: next,
			tokens: tokens.slice(1),
		}
	}

	// F -> (E)
	if (Token.Lparen.is(next)) {
		// eslint-disable-next-line no-use-before-define
		const expressionResult = parseExpression(tokens.slice(1)) // skip Lparen
		// confirm expression ends in Rparen
		if (!Token.Rparen.is(expressionResult.tokens[0])) {
			throw Error(`Unexpected token: ${expressionResult.tokens[0]}`)
		}
		return {
			PT: expressionResult.PT,
			tokens: expressionResult.tokens.slice(1), // omit Rparen
		}
	}

	// F -> S F
	const signResult = parseSign(tokens)
	const factorResult = parseFactor(signResult.tokens)
	return {
		PT: ParseTree.Factor(
			signResult.PT,
			factorResult.PT,
		),
		tokens: factorResult.tokens,
	}
}

// parseB :: List<Token> -> { PT, List<Token> }
const parseF2 = tokens => {

	const next = tokens[0]

	// F2 -> epsilon
	const isMul = Token.Mul.is(next)
	const isDiv = Token.Div.is(next)
	if (!isMul && !isDiv) {
		return {
			PT: ParseTree.EpsilonF,
			tokens,
		}
	}

	// F2 -> * F F2 | / F F2
	const op = next
	const factorResult = parseFactor(tokens.slice(1))
	const f2Result = parseF2(factorResult.tokens)
	return {
		PT: ParseTree.F2(
			op,
			factorResult.PT,
			f2Result.PT,
		),
		tokens: f2Result.tokens,
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
			f2Result.PT,
		),
		tokens: f2Result.tokens,
	}
}

// parseA :: List<Token> -> { PT, List<Token> }
const parseT2 = tokens => {

	const next = tokens[0]

	// T2 -> epsilon
	const isAdd = Token.Add.is(next)
	const isSub = Token.Sub.is(next)
	if (!isAdd && !isSub) {
		return {
			PT: ParseTree.EpsilonT,
			tokens,
		}
	}

	// T2 -> + T T2 | - T T2
	const op = next
	const termResult = parseTerm(tokens.slice(1))
	const t2Result = parseT2(termResult.tokens)
	return {
		PT: ParseTree.T2(
			op,
			termResult.PT,
			t2Result.PT,
		),
		tokens: t2Result.tokens,
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
		tokens: t2Result.tokens,
	}
}

// parse :: List<Token> -> ParseTree
const parse = tokens => parseExpression(tokens).PT

module.exports = {
	ParseTree,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
	parse,
}
