function arrayToObject (array) {
  let obj = {}
  array.forEach((item) => {
    obj[item] = true
  })
  return obj
}

export default arrayToObject
