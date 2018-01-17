'use strict'; // eslint-disable-line semi

// The generator is where using Daggy pays off beautifully. Catamorphisms are
// ideal for recursing through the parse tree and dispatching on node type.

// evaluate :: ParseTree -> Number
const evaluate = tree => tree.cata({
	// convert string to JS float
	Number: value => +value,
	// possibly negate a factor
	Factor: (sign, child) => evaluate(sign) * evaluate(child),
	// convert sign to multiplier
	Sub: () => -1,
	// combine (possibly inverse) factor with following value
	F2: (op, factor, childF2) => op.cata({
		Mul: () =>     evaluate(factor) * evaluate(childF2),
		Div: () => 1 / evaluate(factor) * evaluate(childF2),
	}),
	// "nothing" factor = multiplicative identity
	EpsilonF: () => 1,
	// combine (possibly inverse) term with following value
	T2: (op, term, childT2) => op.cata({
		Add: () =>      evaluate(term) + evaluate(childT2),
		Sub: () => -1 * evaluate(term) + evaluate(childT2),
	}),
	// "nothing" term = additive identity
	EpsilonT: () => 0,
	// combine factor with following value
	Term: (factor, childF2) => evaluate(factor) * evaluate(childF2),
	// combine term with following value
	Expression: (term, childT2) => evaluate(term) + evaluate(childT2),
})

// rpn :: ParseTree -> String
const rpn = tree => tree.cata({
	// number is already a string
	Number: id => id,
	// possibly negate a factor
	Factor: (sign, child) => rpn(child) + rpn(sign),
	// convert sign to multiplier
	Sub: () => ' -1 *',
	// move operator to postfix
	F2: (op, factor, childF2) => op.cata({
		Mul: () => ' ' + rpn(factor) + ' *' + rpn(childF2),
		Div: () => ' ' + rpn(factor) +  ' /' + rpn(childF2),
	}),
	// "nothing" factor = identity
	EpsilonF: () => '',
	// move operator to postfix
	T2: (op, term, childT2) => op.cata({
		Add: () => ' ' + rpn(term) + ' +' + rpn(childT2),
		Sub: () => ' ' + rpn(term) + ' -' + rpn(childT2),
	}),
	// "nothing" term = identity
	EpsilonT: () => '',
	// combine factor with following value
	Term: (factor, childF2) => rpn(factor) + rpn(childF2),
	// combine term with following value
	Expression: (term, childT2) => rpn(term) + rpn(childT2),
})

module.exports = {
	evaluate,
	rpn,
}
