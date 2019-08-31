# js-dispatcher #

Flexible Conditional Logic

## Usage ##

### The Basics ###

First, here's an example of a programmatically constructed `if... else if... else` statement:

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


