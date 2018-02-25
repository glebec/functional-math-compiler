'use strict'; // eslint-disable-line semi
const { inspect } = require('util')
const stringify = val => inspect(val, false, null)

// evaluate :: ParseTree | Token -> Number
const evaluate = node => { // eslint-disable-line complexity
	switch (node.type) {
		// convert string to JS float
		case 'Number': return +node.value
		// possibly negate a factor
		case 'Factor': return evaluate(node.sign) * evaluate(node.child)
		// convert sign to multiplier
		case 'Sub': return -1
		// "nothing" sign = multiplicative identity
		case 'EpsilonS': return 1
		// combine (possibly inverse) factor with following value
		case 'F2': {
			const factor = evaluate(node.factor)
			const childF2 = evaluate(node.childF2)
			if (node.op.type === 'Mul') return     factor * childF2
			if (node.op.type === 'Div') return 1 / factor * childF2
			break
		}
		// "nothing" factor = multiplicative identity
		case 'EpsilonF': return 1
		// combine (possibly inverse) term with following value
		case 'T2': {
			const term = evaluate(node.term)
			const childT2 = evaluate(node.childT2)
			if (node.op.type === 'Add') return      term + childT2
			if (node.op.type === 'Sub') return -1 * term + childT2
			break
		}
		// "nothing" term = additive identity
		case 'EpsilonT': return 0
		// combine factor with following value
		case 'Term': return evaluate(node.factor) * evaluate(node.childF2)
		// combine term with following value
		case 'Expression': return evaluate(node.term) + evaluate(node.childT2)
		// how did you even get here?
		default: throw Error(`Compilation error, unexpected node: ${
			stringify(node)
		}`)
	}
}

// evaluate :: ParseTree | Token -> Number
const rpn = node => { // eslint-disable-line complexity
	switch (node.type) {
		// number is already a string
		case 'Number': return node.value
		// possibly negate a factor
		case 'Factor': return rpn(node.child) + rpn(node.sign)
		// convert sign to multiplier
		case 'Sub': return ' -1 *'
		// "nothing" sign = string identity
		case 'EpsilonS': return ''
		// move operator to postfix
		case 'F2': {
			const factor = rpn(node.factor)
			const childF2 = rpn(node.childF2)
			if (node.op.type === 'Mul') return ' ' + factor + ' *' + childF2
			if (node.op.type === 'Div') return ' ' + factor + ' /' + childF2
			break
		}
		// "nothing" factor = string identity
		case 'EpsilonF': return ''
		// move operator to postfix
		case 'T2': {
			const term = rpn(node.term)
			const childT2 = rpn(node.childT2)
			if (node.op.type === 'Add') return ' ' + term + ' +' + childT2
			if (node.op.type === 'Sub') return ' ' + term + ' -' + childT2
			break
		}
		// "nothing" term = string identity
		case 'EpsilonT': return ''
		// combine factor with following value
		case 'Term': return rpn(node.factor) + rpn(node.childF2)
		// combine term with following value
		case 'Expression': return rpn(node.term) + rpn(node.childT2)
		// how did you even get here?
		default: throw Error(`Compilation error, unexpected node: ${
			stringify(node)
		}`)
	}
}

module.exports = {
	evaluate,
	rpn,
}
