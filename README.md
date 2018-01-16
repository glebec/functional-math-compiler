# Functional JS Arithmetic Exprsssion Compiler

Compiler exercise for education. Parsing infix arithmetic expressions via LL(1) recursive descent, adhering to functional approaches.

## Features

* Pure functions only (no side effects, no mutations, all `const` etc.)
* Uses `daggy` for tagged unions (aka sum types)
	* Enables type checking e.g. `Token.Number.is(x)` and `Token.is(x)`
	* Enables simple pattern matching / catamorphisms e.g. `someToken.cata({ Mul: () => true, Div: () => false })`
* Uses Immutable.js List for functional collections
	* Enables efficient `unshift`, `push`, and `slice`
	* Immutability provides strong reasoning benefits

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

## Contents

### Lexer

Converts raw input string to an Immutable.js List of Daggy types (tokens):

* Number (string of digits)
* Lparen
* Rparen
* Mul
* Div
* Add
* Sub

### Parser

Converts list of tokens to a parse tree, aka concrete syntax tree (mostly – uses `null` instead of epsilon):

* Natural (value)
* Factor (child, negate)
* F2 (op, factor, childF2)
* T2 (op, term, childT2)
* Term (factor, childF2)
* Expression (term, childT2)

Note that a CST / PT preserves all or almost all of the syntax as represented by the language's grammar, whereas an Abstract Syntax Tree (AST) reduces the information to the bare minimum necessary for a given use case.

### Generator

In progress.

## Grammar

A grammar is the set of production rules for a language; that is, substitutions which eventually generate any valid string in the language. A simple grammar for expressions (starting from E) is:

```
E -> (E)
E -> E + E
E -> E * E
E -> number
```

Unfortunately, while the above grammar is valid (producing sentences in the language), it is also ambiguous (could be represented by different parse trees, affecting the semantic meaning of the expression). The following is an unambiguous grammar:

```
E -> E + T
E -> T
T -> T ∗ F
T -> F
F -> (E)
F -> number
```

Unfortunately, this grammar is left-recursive, which makes it impossible to parse via LL recursive descent (one of the easiest parsers to implement). The following refactors the grammar to be parsed via an LL(1) algorithm:

```
E  ->   T T2
T2 -> + T T2
T2 -> ε
T  ->   F F2
F2 -> * F F2
F2 -> ε
F  -> (E)
F  -> number
```

A formal EBNF notation of a similar grammar is included in the `docs` folder, with the augmentation that we allow for multiplication, subtraction, and negative factors.

## Resources

* [Stanford CS143 Notes on Parsing (PDF)](https://web.stanford.edu/class/archive/cs/cs143/cs143.1156/handouts/parsing.pdf)
