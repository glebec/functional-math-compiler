'use strict'; // eslint-disable-line semi
/* eslint-disable new-cap */

// All the sub-parsers take an Array of Tokens, and return a tuple of
// (a token or parse tree) and (the tokens which the parser did not consume).

// parseFactor :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseFactor = tokens => {

	const next = tokens[0]

	// Factor -> Number
	if (next.type === 'Number') {
		return {
			PT: next,
			remainingTokens: tokens.slice(1),
		}
	}

	// Factor -> (Expression)
	if (next.type === 'LParen') {
		// eslint-disable-next-line no-use-before-define
		const expressionResult = parseExpression(tokens.slice(1)) // skip LParen
		return {
			PT: {
				type: 'Group',
				child: expressionResult.PT,
			},
			remainingTokens: expressionResult.remainingTokens.slice(1), // skip Rparen
		}
	}

	// Factor -> Sign Factor
	if (next.type === 'Minus') {
		const factorResult = parseFactor(tokens.slice(1))
		return {
			PT: {
				type: 'Negation',
				child: factorResult.PT,
			},
			remainingTokens: factorResult.remainingTokens,
		}
	}

	throw Error(`Parse error, unexpected token: ${next}`)
}

// parseB :: [Token] -> { PT: ParseTree, remainingTokens: [Token] }
const parseF2 = tokens => {

	const next = tokens[0]

	// F2 -> EpsilonF
	const isStar  = next && next.type === 'Star'
	const isSlash = next && next.type === 'Slash'
	if (!isStar && !isSlash) {
		return {
			PT: { type: 'EpsilonF' },
			remainingTokens: tokens,
		}
	}

	// F2 -> * Factor F2 | / Factor F2
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
	// Term -> Factor F2
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

	// T2 -> EpsilonT
	const isAdd = next && next.type === 'Plus'
	const isSub = next && next.type === 'Minus'
	if (!isAdd && !isSub) {
		return {
			PT: { type: 'EpsilonT' },
			remainingTokens: tokens,
		}
	}

	// T2 -> + Term T2 | - Term T2
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
	// Expression -> Term T2
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
