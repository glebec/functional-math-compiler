'use strict'; // eslint-disable-line semi

const { lex } = require('./lexer')
const { parse } = require('./parser')
const { evaluate } = require('./generator')

// could import this e.g. from Ramda, but it's small enough to define inline.
const pipe = (...fns) => input => fns.reduce((data, fn) => fn(data), input)

// compiler orchestrates front-end and back-end to translate input to output.
// compile :: String -> Number
const compile = pipe(lex, parse, evaluate)

// SIDE EFFECTS! OH THE HORROR
console.log(compile('-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)')) // 20.8
