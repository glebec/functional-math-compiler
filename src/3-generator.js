'use strict'; // eslint-disable-line semi
const { inspect } = require('util')
const stringify = val => inspect(val, false, null, true)

// evaluate :: ParseTree | Token -> Number
const evaluate = node => {
	switch (node.type) {
		// convert string to JS float
		case 'Number': return +node.value
		// negate a factor
		case 'NegationF': return -1 * evaluate(node.childFactor)
		// combine factor with following value
		case 'MultiplicativeF2': return evaluate(node.childFactor) * evaluate(node.childF2)
		// combine (inverse) factor with following value
		case 'DivisionalF2': return 1 / evaluate(node.childFactor) * evaluate(node.childF2)
		// "nothing" factor = multiplicative identity
		case 'EpsilonF2': return 1
		// combine term with following value
		case 'AdditiveT2': return evaluate(node.childTerm) + evaluate(node.childT2)
		// combine (inverse) term with following value
		case 'SubtractiveT2': return -1 * evaluate(node.childTerm) + evaluate(node.childT2)
		// "nothing" term = additive identity
		case 'EpsilonT2': return 0
		// combine factor with following value
		case 'Term': return evaluate(node.childFactor) * evaluate(node.childF2)
		// combine term with following value
		case 'Expression': return evaluate(node.childTerm) + evaluate(node.childT2)
		// grouped expressions are just the evaluation of their contents
		case 'GroupF': return evaluate(node.childExpression)
		// how did you even get here?
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${stringify(node)}`)
}

// rpn :: ParseTree | Token -> String
const rpn = node => {
	switch (node.type) {
		// number is already a string
		case 'Number': return node.value
		// negate a factor
		case 'NegationF': return rpn(node.childFactor) + ' -1 *'
		// move operator to postfix
		case 'MultiplicativeF2': return ' ' + rpn(node.childFactor) + ' *' + rpn(node.childF2)
		// move operator to postfix
		case 'DivisionalF2': return ' ' + rpn(node.childFactor) + ' /' + rpn(node.childF2)
		// "nothing" factor = string identity
		case 'EpsilonF2': return ''
		// move operator to postfix
		case 'AdditiveT2': return ' ' + rpn(node.childTerm) + ' +' + rpn(node.childT2)
		// move operator to postfix
		case 'SubtractiveT2': return ' ' + rpn(node.childTerm) + ' -' + rpn(node.childT2)
		// "nothing" term = string identity
		case 'EpsilonT2': return ''
		// combine factor with following value
		case 'Term': return rpn(node.childFactor) + rpn(node.childF2)
		// combine term with following value
		case 'Expression': return rpn(node.childTerm) + rpn(node.childT2)
		// RPN doesn't need parens — we can re-write the contents of a group
		case 'GroupF': return rpn(node.childExpression)
		// how did you even get here?
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${stringify(node)}`)
}

// original :: ParseTree | Token -> String
const original = node => {
	switch (node.type) {
		// number is already a string
		case 'Number': return node.value
		// negate a factor
		case 'NegationF': return '-' + original(node.childFactor)
		// convert operation to string with nice whitespace
		case 'MultiplicativeF2': return ' * ' + original(node.childFactor) + original(node.childF2)
		// convert operation to string with nice whitespace
		case 'DivisionalF2': return ' / ' + original(node.childFactor) + original(node.childF2)
		// "nothing" factor = string identity
		case 'EpsilonF2': return ''
		// convert operation to string with nice whitespace
		case 'AdditiveT2': return ' + ' + original(node.childTerm) + original(node.childT2)
		// combine (inverse) term with following value
		case 'SubtractiveT2': return ' - ' + original(node.childTerm) + original(node.childT2)
		// "nothing" term = string identity
		case 'EpsilonT2': return ''
		// combine factor with following value
		case 'Term': return original(node.childFactor) + original(node.childF2)
		// combine term with following value
		case 'Expression': return original(node.childTerm) + original(node.childT2)
		// put string parens back around group contents
		case 'GroupF': return '(' +  original(node.childExpression) + ')'
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
