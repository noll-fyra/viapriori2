// turn EXIF GPS arrays into a lat and lng for geocoding
function latLng (image) {

  let data = image.exifdata || null

  if (data.GPSLatitude && data.GPSLongitude && data.GPSLatitudeRef && data.GPSLongitudeRef) {
    let latitudeData = data.GPSLatitude
    let longitudeData = data.GPSLongitude

    let longObj = {}
    longObj['first'] = longitudeData[0].numerator
    longObj['second'] = longitudeData[1].denominator === 1 ? longitudeData[1].numerator : longitudeData[2].numerator
    longObj['third'] = longitudeData[2].denominator === 100 ? longitudeData[2].numerator : longitudeData[1].numerator

    let lng = longObj['first'] + longObj['second'] / 60 + longObj['third'] / 360000

    let latObj = {}
    latObj['first'] = latitudeData[0].numerator
    latObj['second'] = latitudeData[1].denominator === 1 ? latitudeData[1].numerator : latitudeData[2].numerator
    latObj['third'] = latitudeData[2].denominator === 100 ? latitudeData[2].numerator : latitudeData[1].numerator

    let lat = latObj['first'] + latObj['second'] / 60 + latObj['third'] / 360000

    return {lat: data.GPSLatitudeRef.toLowerCase() === 'n' ? lat : -lat, lng: data.GPSLongitudeRef.toLowerCase() === 'e' ? lng : -lng}
  }
  return {lat: null, lng: null}
}

// separate a geocoded address
function getLocation (data) {
  let locality = null
  let country = null
  data.address_components.forEach((address) => {
    if (address.types.includes('locality')) {
      locality = address.long_name
    }
    if (address.types.includes('country')) {
      country = address.long_name
    }
  })
  return [locality, country]
}

export default latLng
export {getLocation}
