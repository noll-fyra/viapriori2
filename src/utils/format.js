function tagsArrayToObject (array) {
  let obj = {}
  array.forEach((item) => {
    obj[item.text] = true
  })
  return obj
}

function allObjectToArray (object) {
  let keys = Object.keys(object)
  // console.log(keys);
  let arr = new Array(keys.length).fill([])
  // console.log('start',arr);
  keys.forEach((key, index) => {
    for (var thing in object[key]) {
      // console.log(arr);
      arr[index].push([thing, object[key][thing]])
    }
  })
  // console.log('end',arr);
  arr.forEach((item) => {
    item.sort((a, b) => { return b[1] - a[1] }).map((item) => { return item[0] })
  })

  console.log(arr)
  return arr
}

export default tagsArrayToObject
export {allObjectToArray}
