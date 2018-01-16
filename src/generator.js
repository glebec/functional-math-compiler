'use strict'; // eslint-disable-line semi

// const { ParseTree } = require('./parser')

// The generator is where using Daggy really pays off. Recursing through the
// parse tree and dispatching on node type is a natural fit for catamorphisms.

// evaluate :: ParseTree -> Number
const evaluate = tree => tree.cata({
	// convert string to JS float
	Natural: value => +value,
	// possibly negate a factor
	Factor: (child, negate) => evaluate(child) * (negate ? -1 : 1),
	// combine (possibly inverse) factor with (possibly null) following value
	F2: (op, factor, childF2) => op.cata({
		Mul: () => (    evaluate(factor) * (childF2 ? evaluate(childF2) : 1)),
		Div: () => (1 / evaluate(factor) * (childF2 ? evaluate(childF2) : 1)),
	}),
	// combine (possibly inverse) term with (possibly null) following value
	T2: (op, term, childT2) => op.cata({
		Add: () => (     evaluate(term) + (childT2 ? evaluate(childT2) : 0)),
		Sub: () => (-1 * evaluate(term) + (childT2 ? evaluate(childT2) : 0)),
	}),
	// combine factor with (possibly null) following value
	Term: (factor, childF2) => (
		evaluate(factor) * (childF2 ? evaluate(childF2) : 1)
	),
	// combine expression with (possibly null) following value
	Expression: (term, childT2) => (
		evaluate(term) + (childT2 ? evaluate(childT2) : 0)
	),
})

module.exports = {
	evaluate
}
