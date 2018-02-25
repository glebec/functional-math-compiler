'use strict'; // eslint-disable-line semi

const matchers = [
	{ type: 'Number', regex: /^\d+/ },
	{ type: 'LParen', regex: /^\(/  },
	{ type: 'RParen', regex: /^\)/  },
	{ type: 'Star',   regex: /^\*/  },
	{ type: 'Slash',  regex: /^\//  },
	{ type: 'Plus',   regex: /^\+/  },
	{ type: 'Minus',  regex: /^-/   },
	{ type: 'Space',  regex: /^\s+/ },
]

// Read: `lex` is a function taking a String and returning an Array of Tokens
// (for our purposes, a Token is just an object with `.type` property)

// lex :: String -> [Token]
const lex = inputStr => {

	// Your job: implement this function

	if (!inputStr) {
		return []
	}

	const match = matchers.reduce(
		(foundMatch, matcher) => {
			if (foundMatch) return foundMatch
			const possibleMatch = matcher.regex.exec(inputStr)
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

	if (match.type === 'Space') {
		return lex(inputStr.slice(1))
	}

	const token = (match.type === 'Number')
		? { type: 'Number', value: match.value }
		: { type: match.type }

	const remaining = inputStr.slice(match.value.length)

	return [token, ...lex(remaining)]
}

// This makes `lex` available to other JS files in Node
module.exports = {
	lex,
}
