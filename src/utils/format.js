function tagsArrayToObject (array) {
  let obj = {}
  array.forEach((item) => {
    obj[item.text] = true
  })
  return obj
}

function tagsObjectToArray (object) {
  // console.log(object);
  let arr = []
  for (var key in object) {
    arr.push([key, object[key]])
  }
  // console.log(arr);
  return arr.sort((a, b) => { return b[1] - a[1] }).map((item) => { return item[0] })
}

export default tagsArrayToObject
export {tagsObjectToArray}
