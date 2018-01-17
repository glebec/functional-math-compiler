'use strict'; // eslint-disable-line semi

// a utility library for building Sum Types in JS
const daggy = require('daggy')

// a functional (immutable) list with efficient ops
const { List } = require('immutable')

// a representative type (of multiple type constructors)
const Token = daggy.taggedSum('Token', {
	Number: ['value'], // a parameterized type
	Lparen: [], // an non-parameterized type
	Rparen: [],
	Mul: [],
	Div: [],
	Add: [],
	Sub: [],
})

const matchers = [
	{ type: 'Number', pattern: /^\d+/ },
	{ type: 'Lparen', pattern: /^\(/  },
	{ type: 'Rparen', pattern: /^\)/  },
	{ type: 'Mul',    pattern: /^\*/  },
	{ type: 'Div',    pattern: /^\//  },
	{ type: 'Add',    pattern: /^\+/  },
	{ type: 'Sub',    pattern: /^-/   },
	{ type: 'space',  pattern: /^\s+/  },
]

// lex :: String -> [Token]
const lex = inputStr => {

	if (!inputStr) {
		// eslint-disable-next-line new-cap
		return List()
	}

	const match = matchers.reduce(
		(foundMatch, matcher) => {
			if (foundMatch) return foundMatch
			const possibleMatch = matcher.pattern.exec(inputStr)
			return possibleMatch && {
				type: matcher.type,
				value: possibleMatch[0],
			}
		},
		null
	)

	if (!match) {
		throw Error(`Parse error at: ${inputStr}`)
	}

	if (match.type === 'space') {
		return lex(inputStr.slice(1))
	}

	const token = (match.type === 'Number')
		? Token.Number(match.value)
		: Token[match.type]

	const remaining = inputStr.slice(match.value.length)

	// efficient unshift from Immutable.js List
	return lex(remaining).unshift(token)
}

module.exports = {
	Token,
	lex,
}
