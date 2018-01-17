'use strict'; // eslint-disable-line semi

const { lex } = require('./lexer')
const { parse } = require('./parser')
const { evaluate, rpn } = require('./generator')

// impurity! External input! Oh what a world…
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

// SIDE EFFECTS! OH THE HORROR
const main = pipe(compile, console.log.bind(console))

// here we go…
main(inputStr)
