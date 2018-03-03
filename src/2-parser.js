'use strict'; // eslint-disable-line semi
/* eslint-disable new-cap */

// All the sub-parsers take an Array of Tokens, and return a tuple of
// (a token or parse tree) and (the tokens which the parser did not consume).

// parseFactor :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseFactor = tokens => {

	const next = tokens[0]

	// NumericF rule: Factor -> Number
	if (next.type === 'Number') {
		// implement me!
	}

	// NegativeF rule: Factor -> - Factor
	if (next.type === 'Minus') {
		// implement me!
	}

	// GroupF rule: Factor -> (Expression)
	if (next.type === 'LParen') {
		// implement me (at the end, after `parseExpression`)
	}

	throw Error(`Parse error, unexpected token: ${next}`)
}

// parseB :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseF2 = tokens => {

	const next = tokens[0]

	// F2 -> EpsilonF

	// ...

	// MultiplicativeF2 rule: F2 -> * Factor F2
	// DivisionalF2 rule:     F2 -> / Factor F2

	// ...
}

// parseTerm :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseTerm = tokens => {

	// Term -> Factor F2
	// ...

}

// parseA :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseT2 = tokens => {

	// T2 -> EpsilonT
	// T2 -> + Term T2
	// T2 -> - Term T2

}

// parseExpression :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseExpression = tokens => {

	// Expression -> Term T2

}

// parse :: [Token] -> ParseTree (for an expression)
const parse = tokens => undefined // implement me!

module.exports = {
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
	parse,
}
