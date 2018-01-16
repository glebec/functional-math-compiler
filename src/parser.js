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

// parseNatural :: String -> Number
const parseNatural = tokens => tokens[0].cata({
	Number: numStr => +numStr
})

// parseInteger :: [Token] -> { PT, [Token] }
const parseInteger = tokens => {
	// Int -> Nat | - Nat
	const multiplier = tokens[0].cata({
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

// parseFactor :: [Token] -> { PT, [Token] }
const parseFactor = tokens => {
	// F -> Int
	if (!Token.Lparen.is(tokens[0])) {
		return parseInteger(tokens)
	}
	// F -> (E)
	// eslint-disable-next-line no-use-before-define
	const result = parseExpression(tokens.slice(1))
	if (!Token.Rparen.is(result.tokens[0])) {
		throw Error(
			'Unexpected token: ' +
			(result.tokens[0] && result.tokens[0].toString())
		)
	}
	return {
		PT: result.PT,
		tokens: result.tokens.slice(1) // remove Rparen
	}
}

// parseB :: [Token] -> { PT, [Token] }
const parseF2 = tokens => {
	// B -> epsilon
	if (
		!Token.Mul.is(tokens[0]) &&
		!Token.Div.is(tokens[0])
	) {
		return {
			PT: null,
			tokens
		}
	}
	// B -> * F F2 | / F F2
	const op = tokens[0]
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

// parseTerm :: [Token] -> { PT, [Token] }
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

// parseA :: [Token] -> { PT, [Token] }
const parseT2 = tokens => {
	// A -> epsilon
	if (
		!Token.Add.is(tokens[0]) &&
		!Token.Sub.is(tokens[0])
	) {
		return {
			PT: null,
			tokens
		}
	}
	// T2 -> + T T2 | - T T2
	const op = tokens[0]
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

// parseExpression :: [Token] -> { PT, [Token] }
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

// parse :: [Token] -> ParseTree
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
