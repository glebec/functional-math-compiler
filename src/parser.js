'use strict'; // eslint-disable-line semi
/* eslint-disable new-cap */

// a utility library for building Sum Types in JS
const daggy = require('daggy')

const { Token, lex } = require('./lexer')

const ParseTree = daggy.taggedSum('ParseTree', {
	Integer: ['value'],
	Factor: ['child'],
	F2: ['op', 'factor', 'childF2'],
	T2: ['op', 'term', 'childT2'],
	Term: ['factor', 'b'],
	Expression: ['term', 'a'],
})

// Natural and Integer are actually evaluating, which strictly speaking means they are not creating parse tree nodes but rather AST nodes. We could be purists and do a true parse tree but it gets pretty extensive e.g. with individual `digit` nodes.

// parseNatural :: String -> Number
const parseNatural = tokens => tokens.first().cata({
	Number: numStr => +numStr
})

// parseInteger :: List<Token> -> { PT, List<Token> }
const parseInteger = tokens => {
	// Int -> Nat | - Nat
	const multiplier = tokens.first().cata({
		Sub: () => -1,
		Number: () => 1
	})
	const offset = multiplier < 0 ? 1 : 0
	return {
		PT: ParseTree.Integer(
			multiplier * parseNatural(tokens.slice(offset))
		),
		tokens: tokens.slice(offset + 1),
	}
}

// parseFactor :: List<Token> -> { PT, List<Token> }
const parseFactor = tokens => {
	// F -> I
	if (!Token.Lparen.is(tokens.first())) {
		return parseInteger(tokens)
	}
	// F -> (E)
	// eslint-disable-next-line no-use-before-define
	const result = parseExpression(tokens.slice(1))
	if (!Token.Rparen.is(result.tokens.first())) {
		throw Error(
			'Unexpected token: ' +
			(result.tokens.first() && result.tokens.first().toString())
		)
	}
	return {
		PT: result.PT,
		tokens: result.tokens.slice(1) // remove Rparen
	}
}

// parseB :: List<Token> -> { PT, List<Token> }
const parseF2 = tokens => {
	// B -> epsilon
	if (
		!Token.Mul.is(tokens.first()) &&
		!Token.Div.is(tokens.first())
	) {
		return {
			PT: null,
			tokens
		}
	}
	// B -> * F F2 | / F F2
	const op = tokens.first()
	const factorResult = parseFactor(tokens.slice(1))
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
	// A -> epsilon
	if (
		!Token.Add.is(tokens.first()) &&
		!Token.Sub.is(tokens.first())
	) {
		return {
			PT: null,
			tokens
		}
	}
	// T2 -> + T T2 | - T T2
	const op = tokens.first()
	const termResult = parseTerm(tokens.slice(1))
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

console.dir(parseExpression(lex('4 + (3 / 2) * (1 - 77 + -3)')).PT, {
	depth: null,
	colors: true
})

module.exports = {
	parse,
	parseNatural,
	parseInteger,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
}
