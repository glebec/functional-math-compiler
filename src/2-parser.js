'use strict'; // eslint-disable-line semi
const { inspect } = require('util')
/* eslint-disable new-cap */

// const ParseTree = daggy.taggedSum('ParseTree', {
// 	Factor: ['sign', 'child'],
// 	F2: ['op', 'factor', 'childF2'],
// 	T2: ['op', 'term', 'childT2'],
// 	Term: ['factor', 'childF2'],
// 	Expression: ['term', 'childT2'],
// 	EpsilonF: [], // multiplicative identity
// 	EpsilonT: [], // additive identity
// })

// All the sub-parsers take an Array of Tokens, and return a tuple of
// (a token or parse tree) and (the tokens which the parser did not consume).

// parseSign :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseSign = tokens => {

	const next = tokens[0]

	// S -> Sub
	if (next && next.type === 'Sub') {
		return {
			PT: next, // tree nodes can be tokens
			remainingTokens: tokens.slice(1), // one token is consumed
		}
	}

	// S -> EpsilonS
	return {
		PT: { type: 'EpsilonS' }, // indicate no `-` sign found
		remainingTokens: tokens, // no tokens were consumed
	}
}

// parseFactor :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseFactor = tokens => {

	const next = tokens[0]

	// F -> Number
	if (next && next.type === 'Number') {
		return {
			PT: next,
			remainingTokens: tokens.slice(1),
		}
	}

	// F -> (E)
	if (next && next.type === 'LParen') {
		// eslint-disable-next-line no-use-before-define
		const expressionResult = parseExpression(tokens.slice(1)) // skip LParen
		// confirm expression ends in RParen
		if (expressionResult.remainingTokens[0].type !== 'RParen') {
			throw Error(`Unexpected token: ${
				inspect(expressionResult.remainingTokens[0], false, null)
			}`)
		}
		return {
			PT: expressionResult.PT,
			remainingTokens: expressionResult.remainingTokens.slice(1), // omit Rparen
		}
	}

	// F -> S F
	const signResult = parseSign(tokens)
	const factorResult = parseFactor(signResult.remainingTokens)
	return {
		PT: {
			type: 'Factor',
			sign: signResult.PT,
			child: factorResult.PT,
		},
		remainingTokens: factorResult.remainingTokens,
	}
}

// parseB :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseF2 = tokens => {

	const next = tokens[0]

	// F2 -> epsilon
	const isMul = next && next.type === 'Mul'
	const isDiv = next && next.type === 'Div'
	if (!isMul && !isDiv) {
		return {
			PT: { type: 'EpsilonF' },
			remainingTokens: tokens,
		}
	}

	// F2 -> * F F2 | / F F2
	const op = next
	const factorResult = parseFactor(tokens.slice(1))
	const f2Result = parseF2(factorResult.remainingTokens)
	return {
		PT: {
			type: 'F2',
			op: op,
			factor: factorResult.PT,
			childF2: f2Result.PT,
		},
		remainingTokens: f2Result.remainingTokens,
	}
}

// parseTerm :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseTerm = tokens => {
	// T -> F F2
	const factorResult = parseFactor(tokens)
	const f2Result = parseF2(factorResult.remainingTokens)
	return {
		PT: {
			type: 'Term',
			factor: factorResult.PT,
			childF2: f2Result.PT,
		},
		remainingTokens: f2Result.remainingTokens,
	}
}

// parseA :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseT2 = tokens => {

	const next = tokens[0]

	// T2 -> epsilon
	const isAdd = next && next.type === 'Add'
	const isSub = next && next.type === 'Sub'
	if (!isAdd && !isSub) {
		return {
			PT: { type: 'EpsilonT' },
			remainingTokens: tokens,
		}
	}

	// T2 -> + T T2 | - T T2
	const op = next
	const termResult = parseTerm(tokens.slice(1))
	const t2Result = parseT2(termResult.remainingTokens)
	return {
		PT: {
			type: 'T2',
			op: op,
			term: termResult.PT,
			childT2: t2Result.PT,
		},
		remainingTokens: t2Result.remainingTokens,
	}
}

// parseExpression :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseExpression = tokens => {
	// E -> T T2
	const termResult = parseTerm(tokens)
	const t2Result = parseT2(termResult.remainingTokens)
	return {
		PT: {
			type: 'Expression',
			term: termResult.PT,
			childT2: t2Result.PT,
		},
		remainingTokens: t2Result.remainingTokens,
	}
}

// parse :: [Token] -> ParseTree
const parse = tokens => parseExpression(tokens).PT

module.exports = {
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
	parse,
}
