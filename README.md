# UsingJS by [InventiStudio](https://inventi.studio)
Minimal, easy to use chaining lib 🚀

## Getting started

#### Install:

* Npm:
  ```bash
  npm install @inventistudio/using-js
  ```

* Yarn:
  ```bash
  yarn add @inventistudio/using-js
  ```

#### Import:

* ES5:
  ```javascript
  var using = require('@inventistudio/using-js')
  ```

* Yarn:
  ```javascript
  import using from '@inventistudio/using-js'
  ```

## Example

You can easily use it with your own methods or any functional library (e.g. RamdaJS)

```javascript
import R from 'ramda'
import using from '@inventistudio/using-js'

// Data
const response = [
  { name: 'Zulu', age: 12,   role: 'admin' },
  { name: 'John', age: 20,   role: 'user'  },
  { name: 'Don',  age: null, role: 'owner' },
]

// Params
const onlyAdults = false
const sortBy     = 'role'

// 🚀 Chain 🚀
const persons = using(response)
  // Get only with age
  .do(R.filter(person => person.age))
  // Get only adluts if it's required (boolean condition example)
  .doIf(onlyAdults, R.filter(person => person.age >= 18))
  // Throw error unless persons array is not empty (functional condition example)
  .doUnless(persons => persons.length, () => { throw new Error('Empty array') })
  // Alow only sorting by age and name (default)
  .switch(sortBy, {
    age:     R.sortBy(R.prop('age')),
    default: R.sortBy(R.prop('name'))
  })
  // Get value
  .value()

console.log(persons)
// >
/*
[
  { name: 'John', age: 20, role: 'user' },
  { name: 'Zulu', age: 12, role: 'admin' },
]
*/
```

## API

#### using(data : Any) : wrapper
It wraps data and returns object which contains below methods

```javascript
using([1,2,4])
using({ name: 'Mike' })
using(10)
...you get it.
```


#### wrapper.value() : Any
Returns value.

```javascript
using(1).value() // 1
```

#### wrapper.do(func : Function (data : Any -> wrapper))
It invokes func with data passed

```javascript
// vanilla js
using([1,2,4])
  .do((arr) => arr.length)
  .value() // 3

// with ramda
using([1,2,4])
  .do(R.filter(n => n%2===0))
  .value() // [2,4]
...
```

#### wrapper.doIf(condition : Any, func : Function (data : Any -> Any)) : wrapper
It invokes func with data passed if condition is "truthy". Otherwise returns wrapper.
If condition is function, it'll be invoked with data passed

```javascript
// boolean condition
const onlyEven = true
using([1,2,4])
  .doIf(onlyEven, R.filter(n => n%2===0))
  .value() // [2,4] or [1,2,4] if onlyEven = false

// functional condition
using([1,2,4])
  .doIf((arr) => arr.length, R.filter(n => n%2===0))
  .value() // [2,4]
...
```

#### wrapper.doUnless(condition : Any, func : Function (data : Any -> data : Any)) : wrapper
It invokes func with data passed if condition is "falsy". Otherwise returns wrapper.
If condition is function, it'll be invoked with data passed

```javascript
// boolean condition
const withOdds = true
using([1,2,4])
  .doUnless(withOdds, R.filter(n => n%2===0))
  .value() // [1,2,4] or [1,2] if withOdds = false
```

#### wrapper.doIfElse(condition : Any, funcTruthy : Function (data : Any -> Any), funcFalsy : Function (data : Any -> Any)) : wrapper
It invokes funcTruthy with data passed if condition is "truthy". Otherwise it invokes funcFalsy.
If condition is function, it'll be invoked with data passed

```javascript
using(user)
  .doIfElse(hasPermission, fetchData, askForPermission)
  .value()
...
```

#### wrapper.switch([functionName : Any], Object<Any, Function (data : Any -> data : Any)>) : wrapper
It invokes object[functionName] with data passed. If it not exists, it tries to invoke object['default']. If function name is skipped, it uses data as functionName. It returns wrapper if there is no default case.

```javascript
// boolean condition
const withOdds = true
using([1,2,4])
  .switch((arr) => `has${arr.length}Elements`, {
    has1Elements() {
      return 'Single'
    },
    has2Elemenets() {
      return 'Pair'
    }
    default() {
      return 'Group'
    }
  })
  .value() // 'Group'
```

#### wrapper.debug(logFunction : Function (Any) : Void) : wrapper
It calls passed function without mutating data

```javascript
// with ramda
using([1,2,4])
  .do(R.filter(n => n%2===0))
  .debug(console.log)
  .value() // [2,4]
```

## Asynchronous functions

`using.async(value)` allows you to use functions that returns promises. Speaking more specifically, if value is a promise, function will be invoked as `data.then(func)` instead of `func(data)`.

```javascript

const post = { title: 'Lorem ipsum...', content: '   test   ' }

const newPost = await using.async(post)
  .do(sanitizeContent) // result = sanitizeContent(post)
  .do(Post.create)     // result = Post.create(result) -- function returns Promise ⚠️
  .do(mapWithAuthor)   // result = result.then(mapWithAuthor) ❤️
  .value()
```
