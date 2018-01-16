# Functional JS Arithmetic Exprsssion Compiler

Compiler exercise for learning purposes. Parsing infix arithmetic expressions.

## Features

* Pure functions only (no side effects, no mutations, all `const` etc.)
* Uses `daggy` for tagged unions (aka sum types)
	* Enables type checking e.g. `Token.Number.is(x)` and `Token.is(x)`
	* Enables simple pattern matching / catamorphisms e.g. `someToken.cata({ Mul: () => true, Div: () => false })`
* Uses Immutable.js List for immutable & efficient collections
	* Enables efficient `unshift`, `push`, and `slice`
	* Prevents accidental mutations

## Contents

Formal grammar (EBNF) in `docs` folder.

### Lexer

Converts raw input string to an Immutable.js List of Daggy types (tokens).

### Parser

Converts list of tokens to a parse tree (mostly – eagerly evaluates positive and negative values, and uses `null` instead of epsilon nodes).

### Generator

In progress.

## Use

```sh
yarn
yarn test # optional
yarn start '5 + (1 + 2) / 3 * -((8 - -2) / 1)'
```

### Supports

* Integers (±)
* Addition
* Subtraction
* Multiplication
* Division
* Grouping (parens)
