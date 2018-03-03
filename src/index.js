'use strict'; // eslint-disable-line semi

const { lex } = require('./1-lexer')
const { parse } = require('./2-parser')
const { evaluate, rpn } = require('./3-generator')

// checking command flags for backend choice
const inputStr = process.argv[2]
const evalFlag = process.argv[3] === '--eval'

// could import this e.g. from Ramda, but it's small enough to define inline.
const pipe = (...fns) => input => fns.reduce((data, fn) => fn(data), input)

// frontEnd :: String -> ParseTree
const frontEnd = pipe(lex, parse)

// backEnd :: ParseTree -> String (rpn) | Number (eval)
const backEnd = evalFlag ? evaluate : rpn

// compile :: String -> String (rpn) | Number (eval)
const compile = pipe(frontEnd, backEnd)

// the only side effect in all of the solution code
const main = pipe(compile, console.log.bind(console))

// here we go…
main(inputStr)
