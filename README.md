# conditional-love #

Programmatically construct conditional expressions

## Installation ##

```shell
npm install conditional-love
```

## Usage ##

### Basic Dispatcher Stuffs ###

Here's an example of a programmatically constructed `if... else if... else` statement:

```typescript
import {
  Dispatcher,
  IF, RETURN,
} from 'conditional-love';

// This Dispatcher accepts 2 numbers as inputs and
// returns a number as an output.
const d = Dispatcher<[number, number], number>();

// Setup our Dispatcher rules:
d.use(IF((x, y)=> x < y, (x, y)=> x + y));
d.use(IF((x, y)=> x > y, (x, y)=> x * y));

// Alright, let's put it to the test:
console.log(d(3, 4));   // Output: 7
console.log(d(4, 3));   // Output: 12
console.log(d(3, 3));   // Throws UnhandledArgumentsError
```

Notice that there are no rules in place to handle the `d(3, 3)` case.  By default, this will cause the `Dispatcher` to throw an `UnhandledArgumentsError`.  You can override this behavior via the `Dispatcher#otherwise(...)` method:

```typescript
d.otherwise((x, y)=> 0);
```

Returning a default value is a very common pattern.  Therefore, you can also specify this same behavior as:

```typescript
d.otherwise(RETURN(0));
```

### Advanced Dispatcher Stuffs ###

The `IF(condition, handler)` function is just a factory for producing a very common type of `RULE_FUNCTION`.  Specifically, the `RULE_FUNCTION` has the form:

```typescript
function _if(...args) {
  if(condition(...args)) {
    return handler;
  }
}
```

As you can see, it evaluates the `condition(..)`.  If this condition returns something truthy, then it returns the associated `handler(..)` function.  Otherwise, it returns `undefined`.  This protocol informs the `Dispatcher` about whether or not the `RULE_FUNCTION` is able to handle the input.

Most of the time, you don't need to worry about this level of detail, and you can just rely upon the `IF(..)` factory.  But, on rare occassions, both the `RULE_FUNCTION` and the `handler(..)` function rely upon the same computationally-expensive operation.  In these cases, you can write your own `RULE_FUNCTION` by hand to minimize computational costs.  For example:

```typescript
function customRule(...args) {
  const expensive = someExpensiveCalculation(...args);

  if(someCondition(expensive)) {
    function handler() {
      return doSomethingWith(expensive);
    }

    return handler;
  }
}


d.use(customRule);
```

## Predicate Function Stuffs ##

It's pretty common to find ourselves writing code such as the following:

```typescript
function hasLatitude(x) {
  return typeof(x.latitude) === 'number';
}

function hasLongitude(x) {
  return typeof(x.longitude) === 'number';
}

function isGeo(x) {
  return hasLatitude(x) && hasLongitude(x);
}
```

This is fine, but the definition of the `isGeo(..)` function is somewhat imperative.  We can express it in a more declarative fashion as follows:

```typescript
import {AND} from 'conditional-love';

function hasLatitude(x) {
  return typeof(x.latitude) === 'number';
}

function hasLongitude(x) {
  return typeof(x.longitude) === 'number';
}

const isGeo = AND([
  hasLatitude,
  hasLongitude,
]);
```

Likewise, `conditional-love` also provides `OR(..)` and `NOT(..)` functions as well.  So, this allows you to construct expressions such as:

```typescript
import {
  AND, OR, NOT,
} from 'conditional-love';

// A Location can be either a Geo or a non-empty String
const isLocation = OR([
  isGeo,
  AND([
    isString,
    NOT(isEmpty),
  ])
]);
```

These functions are useful when you are trying to build your own domain-specific language.  For instance, let's say we want to implement a pattern matcher for domain names.  You could then do something like this:

```typescript
// Hard-coded example.  In practice, you would actually use this
// DSL to construct domain pattern matchers programmatically.
const isAcceptableDomain = OR([
  Exactly("foo.com"),
  AND([
    SubdomainOf("foo.com"),
    NOT(
      Exactly("invalid.foo.com")
    ),
  ])
]);


// Test the function we produced via our domain-specific language
isAcceptableDomain("foo.com");              // true
isAcceptableDomain("bar.foo.com");          // true
isAcceptableDomain("invalid.foo.com");      // false
isAcceptableDomain("not.invalid.foo.com");  // true
```
