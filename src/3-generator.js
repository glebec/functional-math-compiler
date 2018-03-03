'use strict'; // eslint-disable-line semi
const { inspect } = require('util')
const prettyString = val => inspect(val, false, null, true)

// original :: ParseTree | Token -> String
const original = node => {
	switch (node.type) {
		case 'NumericF':  return 'wrong' // fix me!
		case 'NegativeF': return // implement me!

		// ... fill in the rest...

		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${prettyString(node)}`)
}

// evaluate :: ParseTree | Token -> Number
const evaluate = node => {
	switch (node.type) {

		// implement me!

		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${prettyString(node)}`)
}

// rpn :: ParseTree | Token -> String
const rpn = node => {
	switch (node.type) {

		// implement me!

		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${prettyString(node)}`)
}

module.exports = {
	original,
	evaluate,
	rpn,
}
