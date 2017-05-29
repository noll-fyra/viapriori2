import fixOrientation from 'fix-orientation'

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
  return finalArray // format is alphabetical: [countries, localities, saved, tags]
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
  return finalArray // format is alphabetical: [countries, localities, saved, tags]
}

function convertImageToDataURL (url) {
  let final
  var image = new Image()
  image.src = url
  var canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext('2d').drawImage(image, 0, 0)
  fixOrientation(canvas.toDataURL('image/png'), { image: true }, function (fixed, newImage) {
    final = newImage
  })
  console.log(url);
  console.log(image);
  return image
}

export default tagsArrayToObject
export {tagsObjectToArray, allObjectToArray, trendingObjectToArray, convertImageToDataURL}
