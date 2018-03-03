# JS Arithmetic Expression Compiler

Compiler exercise for education. Parsing infix arithmetic expressions via LL(1) recursive descent through a Concrete Syntax Tree (CST) with one node type per production rule.

## Features

* Possible to solve using pure functions only: no side effects, no mutations, all `const` etc.
* One node type per production rule (allows for zero `if` statements or ternaries in generator code, only control flow via `switch`)
* Extensive test suite

## Use

```sh
npm # installs
npm test # passes
npm start '-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)' # outputs RPN string
npm start '-9 * 2 / -(3 + 7) + ((-4 * 1/2) - -21)' --eval # outputs num
```

## Exercise

```sh
npm run test-watch # start the tests in watch mode
```

Implement the specs found in the `src` folder in order:

1. Lexer
2. Parser
3. Generator

The `compiler.spec.js` will then pass.

**Refer to the lecture notes and LearnDot guide / hints**. This exercise will be very opaque without the extra help!

### Supports

* Integers
* Negation
* Addition
* Subtraction
* Multiplication
* Division
* Grouping (parens)

## Contents

### Lexer

Converts raw input string to an array of Plain Old JavaScript Objects (POJOs) representing lexemes, aka tokens:

* Number (string of digits)
* Lparen
* Rparen
* Star
* Slash
* Plus
* Minus

### Parser

Converts array of tokens to a parse tree, aka concrete syntax tree. Organized by nonterminal category:

* Expression (childTerm, childT2)
* Term (childFactor, childF2)
* T2 rules
  * EpsilonT2
  * AdditiveT2 (childTerm, childT2)
  * SubtractiveT2 (childTerm, childT2)
* Factor rules
  * NumericF (childNumber)
  * NegativeF (childFactor)
  * GroupF (childExpression)
* F2 rules
  * EpsilonF2
  * MultiplicativeF2 (childFactor, childF2)
  * DivisionalF2 (childFactor, childF2)

Note that a CST / PT preserves all or almost all of the syntax as represented by the language's grammar, whereas an Abstract Syntax Tree (AST) reduces the information to the bare minimum necessary for a given use case. Our CST features one node type per _production rule_ rather than for per _nonterminal_, which increases the number of node types but simplifies the generator code.

### Generator

Dispatches based on node type to recursively process the parse tree. Several generators spec'd:

* one which re-generates the input string
* a numerical evaluator
* an infix -> RPN compiler

The compiler is active by default. The evaluator can be chosen from the command line by appending the `--eval` flag.

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

A formal EBNF notation of a similar grammar is included in the `docs` folder, with the augmentation that we allow for division, subtraction, and negative factors.

It is possible to code the parse tree using nonterminals and terminals in the above grammar as node types. However, that necessitates that a given node type (e.g. F) might be polymorphic (have more than one shape). An alternative, which works in any language, is to have a separate node type per production rule (arrow) as discussed earlier.

## Resources

* [Stanford CS143 Notes on Parsing (PDF)](https://web.stanford.edu/class/archive/cs/cs143/cs143.1156/handouts/parsing.pdf)
* [Online RPN <-> Infix Compiler / Evaluator](http://rpnevaluator.andreasandersen.dk/default.aspx) (useful for double-checking)
