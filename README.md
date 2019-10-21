# conditional-love #

Programmatically construct conditional expressions

## Usage ##

### The Basics ###

Here's an example of a programmatically constructed `if... else if... else` statement:

```javascript
const {
  Dispatcher,
  IF, RETURN,
} = require('js-dispatcher');


const d = Dispatcher();

// Setup our Dispatcher rules:
d.use(IF((x, y)=> x < y, (x, y)=> x + y));
d.use(IF((x, y)=> x > y, (x, y)=> x * y));
d.otherwise((x, y)=> 0);


// Alright, let's put it to the test:
console.log(d(3, 4));   // Output: 7
console.log(d(4, 3));   // Output: 12
console.log(d(3, 3));   // Output: 0
```

Notice that `d.otherwise((x, y)=> 0)` always just returns the value `0`.  Since this is a common pattern, you can also write the statement as:

```javascript
d.otherwise(RETURN(0));
```

### Advanced Stuff ###

The `IF(condition, handler)` function is just a factory for producing a very common type of `RULE_FUNCTION`.  Specifically, the `RULE_FUNCTION` has the form:

```javascript
function _if(...args) {
  if(condition(...args)) {
    return handler;
  }
}
```

As you can see, it evaluates the `condition(..)`.  If this condition returns something truthy, then it returns the associated `handler(..)` function.  Otherwise, it returns `undefined`.  This protocol informs the `Dispatcher` about whether or not the `RULE_FUNCTION` is able to handle the input.

Most of the time, you don't need to worry about this level of detail, and you can just rely upon the `IF(..)` factory.  But, on rare occassions, both the `RULE_FUNCTION` and the `handler(..)` function rely upon the same computationally-expensive operation.  In these cases, you can write your own `RULE_FUNCTION` by hand to minimize computational costs.  For example:

```javascript
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

