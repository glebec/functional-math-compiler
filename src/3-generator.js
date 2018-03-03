'use strict'; // eslint-disable-line semi
const { inspect } = require('util')
const prettyString = val => inspect(val, false, null, true)

// original :: ParseTree | Token -> String
const original = node => {
	switch (node.type) {
		case 'NumericF':         return node.childNumber
		case 'NegativeF':        return '-' + original(node.childFactor)
		case 'GroupF':           return '(' +  original(node.childExpression) + ')'
		case 'MultiplicativeF2': return ' * ' + original(node.childFactor) + original(node.childF2)
		case 'DivisionalF2':     return ' / ' + original(node.childFactor) + original(node.childF2)
		case 'EpsilonF2':        return ''
		case 'AdditiveT2':       return ' + ' + original(node.childTerm) + original(node.childT2)
		case 'SubtractiveT2':    return ' - ' + original(node.childTerm) + original(node.childT2)
		case 'EpsilonT2':        return ''
		case 'Term':             return original(node.childFactor) + original(node.childF2)
		case 'Expression':       return original(node.childTerm) + original(node.childT2)
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${prettyString(node)}`)
}

// evaluate :: ParseTree | Token -> Number
const evaluate = node => {
	switch (node.type) {
		case 'NumericF':         return +node.childNumber
		case 'NegativeF':        return -1 * evaluate(node.childFactor)
		case 'GroupF':           return evaluate(node.childExpression)
		case 'MultiplicativeF2': return evaluate(node.childFactor) * evaluate(node.childF2)
		case 'DivisionalF2':     return 1 / evaluate(node.childFactor) * evaluate(node.childF2)
		case 'EpsilonF2':        return 1
		case 'AdditiveT2':       return evaluate(node.childTerm) + evaluate(node.childT2)
		case 'SubtractiveT2':    return -1 * evaluate(node.childTerm) + evaluate(node.childT2)
		case 'EpsilonT2':        return 0
		case 'Term':             return evaluate(node.childFactor) * evaluate(node.childF2)
		case 'Expression':       return evaluate(node.childTerm) + evaluate(node.childT2)
		default: break
	}
	// if we didn't handle a given case, something has gone wrong
	throw Error(`Compilation error, unexpected node: ${prettyString(node)}`)
}

// rpn :: ParseTree | Token -> String
const rpn = node => {
	switch (node.type) {
		case 'NumericF':         return node.childNumber
		case 'NegativeF':        return rpn(node.childFactor) + ' -1 *'
		case 'GroupF':           return rpn(node.childExpression)
		case 'MultiplicativeF2': return ' ' + rpn(node.childFactor) + ' *' + rpn(node.childF2)
		case 'DivisionalF2':     return ' ' + rpn(node.childFactor) + ' /' + rpn(node.childF2)
		case 'EpsilonF2':        return ''
		case 'AdditiveT2':       return ' ' + rpn(node.childTerm) + ' +' + rpn(node.childT2)
		case 'SubtractiveT2':    return ' ' + rpn(node.childTerm) + ' -' + rpn(node.childT2)
		case 'EpsilonT2':        return ''
		case 'Term':             return rpn(node.childFactor) + rpn(node.childF2)
		case 'Expression':       return rpn(node.childTerm) + rpn(node.childT2)
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
