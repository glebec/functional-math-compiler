'use strict'; // eslint-disable-line semi
const { inspect } = require('util')
const stringify = val => inspect(val, false, null, true)

// evaluate :: ParseTree | Token -> Number
const evaluate = node => { // eslint-disable-line complexity
	switch (node.type) {
		// convert string to JS float
		case 'Number': return +node.value
		// possibly negate a factor
		case 'Factor': return evaluate(node.sign) * evaluate(node.child)
		// convert sign to multiplier
		case 'Minus': return -1
		// "nothing" sign = multiplicative identity
		case 'EpsilonS': return 1
		// combine (possibly inverse) factor with following value
		case 'F2': {
			const factor = evaluate(node.factor)
			const childF2 = evaluate(node.childF2)
			if (node.op.type === 'Star')  return     factor * childF2
			if (node.op.type === 'Slash') return 1 / factor * childF2
			break
		}
		// "nothing" factor = multiplicative identity
		case 'EpsilonF': return 1
		// combine (possibly inverse) term with following value
		case 'T2': {
			const term = evaluate(node.term)
			const childT2 = evaluate(node.childT2)
			if (node.op.type === 'Plus')  return      term + childT2
			if (node.op.type === 'Minus') return -1 * term + childT2
			break
		}
		// "nothing" term = additive identity
		case 'EpsilonT': return 0
		// combine factor with following value
		case 'Term': return evaluate(node.factor) * evaluate(node.childF2)
		// combine term with following value
		case 'Expression': return evaluate(node.term) + evaluate(node.childT2)
		// grouped expressions are just the evaluation of their contents
		case 'Group': return evaluate(node.child)
		// how did you even get here?
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${stringify(node)}`)
}

// rpn :: ParseTree | Token -> String
const rpn = node => { // eslint-disable-line complexity
	switch (node.type) {
		// number is already a string
		case 'Number': return node.value
		// possibly negate a factor
		case 'Factor': return rpn(node.child) + rpn(node.sign)
		// convert sign to multiplier
		case 'Minus': return ' -1 *'
		// "nothing" sign = string identity
		case 'EpsilonS': return ''
		// move operator to postfix
		case 'F2': {
			const factor = rpn(node.factor)
			const childF2 = rpn(node.childF2)
			if (node.op.type === 'Star')  return ' ' + factor + ' *' + childF2
			if (node.op.type === 'Slash') return ' ' + factor + ' /' + childF2
			break
		}
		// "nothing" factor = string identity
		case 'EpsilonF': return ''
		// move operator to postfix
		case 'T2': {
			const term = rpn(node.term)
			const childT2 = rpn(node.childT2)
			if (node.op.type === 'Plus')  return ' ' + term + ' +' + childT2
			if (node.op.type === 'Minus') return ' ' + term + ' -' + childT2
			break
		}
		// "nothing" term = string identity
		case 'EpsilonT': return ''
		// combine factor with following value
		case 'Term': return rpn(node.factor) + rpn(node.childF2)
		// combine term with following value
		case 'Expression': return rpn(node.term) + rpn(node.childT2)
		// RPN doesn't need parens — we can re-write the contents of a group
		case 'Group': return rpn(node.child)
		// how did you even get here?
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${stringify(node)}`)
}

// original :: ParseTree | Token -> String
const original = node => { // eslint-disable-line complexity
	switch (node.type) {
		// number is already a string
		case 'Number': return node.value
		// possibly negate a factor
		case 'Factor': return original(node.sign) + original(node.child)
		// convert sign token to string
		case 'Minus': return '-'
		// "nothing" sign = string identity
		case 'EpsilonS': return ''
		// convert operation to string with nice whitespace
		case 'F2': {
			const factor = original(node.factor)
			const childF2 = original(node.childF2)
			if (node.op.type === 'Star')  return ' * ' + factor + childF2
			if (node.op.type === 'Slash') return ' / ' + factor + childF2
			break
		}
		// "nothing" factor = string identity
		case 'EpsilonF': return ''
		// convert operation to string with nice whitespace
		case 'T2': {
			const term = original(node.term)
			const childT2 = original(node.childT2)
			if (node.op.type === 'Plus')  return ' + ' + term + childT2
			if (node.op.type === 'Minus') return ' - ' + term + childT2
			break
		}
		// "nothing" term = string identity
		case 'EpsilonT': return ''
		// combine factor with following value
		case 'Term': return original(node.factor) + original(node.childF2)
		// combine term with following value
		case 'Expression': return original(node.term) + original(node.childT2)
		// put string parens back around group contents
		case 'Group': return '(' +  original(node.child) + ')'
		// how did you even get here?
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${stringify(node)}`)
}

module.exports = {
	evaluate,
	rpn,
	original,
}
