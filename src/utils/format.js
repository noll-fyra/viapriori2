function arrayToObject (array) {
  let obj = {}
  array.forEach((item) => {
    obj[item] = true
  })
  return obj
}

function tagsArrayToObject (array) {
  let obj = {}
  array.forEach((item) => {
    obj[item.text] = true
  })
  return obj
}

export default tagsArrayToObject
