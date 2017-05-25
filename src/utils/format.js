// turn an EXIF DateTime string into a UTC offset numberOfMillisecondsSince1970
function formatDate (EXIFDate) {
  let newDate = EXIFDate.split(' ')[0].split(':')
  let modDate = newDate[0] + '-' + newDate[1] + '-' + newDate[2]
  modDate += 'T'
  let modTime = EXIFDate.split(' ')[1]
  modTime += 'Z'
  let UTC = modDate + modTime
  let offset = (new Date().getTimezoneOffset()) * 60 * 1000
  return Date.parse(UTC) + offset
}

export default formatDate

// let parsedDate = Date.parse(formatDate(image.exifdata.DateTime))
// let offset = (new Date().getTimezoneOffset()) * 60 * 1000
// date = parsedDate + offset
