function tagsArrayToObject (array) {
  let obj = {}
  array.forEach((item) => {
    obj[item.text] = true
  })
  return obj
}

function tagsObjectToArray (object) {
  let keys = Object.keys(object)
  let first = keys.pop()
  return keys.reduce((a, b) => { return a + ', ' + b }, first)
}

function allObjectToArray (object) {
  let keys = Object.keys(object)
  let arr = new Array(keys.length).fill(null)
  keys.forEach((key, index) => {
    let tempArray = []
    for (var thing in object[key]) {
      tempArray.push([thing, object[key][thing]])
    }
    arr[index] = tempArray
  })
  let finalArray = []
  arr.forEach((item) => {
    finalArray.push(item.sort((a, b) => { return b[1] - a[1] }).map((item) => { return item[0] }))
  })
  return finalArray // format is alphabetical: [countries, localities, tags]
}

function trendingObjectToArray (object) {
  let keys = Object.keys(object)
  let arr = new Array(keys.length).fill(null)
  keys.forEach((primaryKey, index) => {
    let primaryObj = {}
    for (var dateKey in object[primaryKey]) {
      for (var thing in object[primaryKey][dateKey]) {
        primaryObj[thing] = primaryObj[thing] ? primaryObj[thing] + object[primaryKey][dateKey][thing] : object[primaryKey][dateKey][thing]
      }
    }
    arr[index] = primaryObj
  })
  let finalArray = []
  arr.forEach((obj, index) => {
    let tempArray = []
    for (var key in obj) {
      tempArray.push([key, obj[key]])
    }
    arr[index] = tempArray
  })
  arr.forEach((item) => {
    finalArray.push(item.sort((a, b) => { return b[1] - a[1] }).map((item) => { return item[0] }))
  })
  return finalArray // format is alphabetical: [countries, localities, tags]
}

export default tagsArrayToObject
export {tagsObjectToArray, allObjectToArray, trendingObjectToArray}
