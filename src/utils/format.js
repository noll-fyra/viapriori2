function formatDate (EXIFDate) {
  let newDate = EXIFDate.split(' ')[0].split(':')
  return newDate[0] + '-' + newDate[1] + '-' + newDate[2]
}

export default formatDate
