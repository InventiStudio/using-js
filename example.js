const R = require('ramda')
const using = require('./index')

// Data
const response = [
  { name: 'Zulu', age: 12,   role: 'admin' },
  { name: 'John', age: 20,   role: 'user'  },
  { name: 'Don',  age: null, role: 'owner' },
]

// Params
const onlyAdults = false
const sortBy     = 'role'

// Chain
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
