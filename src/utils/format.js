function formatDate (EXIFDate) {
  let newDate = EXIFDate.split(' ')[0].split(':')
  let modDate = newDate[0] + '-' + newDate[1] + '-' + newDate[2]
  modDate += 'T'
  let modTime = EXIFDate.split(' ')[1]
  modTime += 'Z'
  return modDate + modTime
}

export default formatDate
