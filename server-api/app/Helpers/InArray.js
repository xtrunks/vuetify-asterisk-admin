'use strict'

module.exports = (keys, searchedKey) => {
  let result = false
  for (let i in keys) {
    if (keys[i] === searchedKey) {
      result = true
    }
  }
  return result
}
