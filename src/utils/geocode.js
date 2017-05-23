import geocoder from 'geocoder'
import EXIF from 'exif-js'

function geocode (image) {
  let data = image.exifdata
  let latitudeData = data.GPSLatitude
    let longitudeData = data.GPSLongitude
  let latitudeIsN = data.GPSLatitudeRef.toLowerCase() === 'n' ? true : false
  let longitudeIsE = data.GPSLongitudeRef.toLowerCase() === 'e' ? true : false

let longObj = {}
longObj['first'] = longitudeData[0].numerator
longObj['second'] = longitudeData[1].denominator === 1 ? longitudeData[1].numerator : longitudeData[2].numerator
longObj['third'] = longitudeData[2].denominator === 100 ? longitudeData[2].numerator : longitudeData[1].numerator

let long = longObj['first'] + longObj['second'] / 60 + longObj['third'] / 3600

let latObj = {}
latObj['first'] = latitudeData[0].numerator
latObj['second'] = latitudeData[1].denominator === 1 ? latitudeData[1].numerator : latitudeData[2].numerator
latObj['third'] = latitudeData[2].denominator === 100 ? latitudeData[2].numerator : latitudeData[1].numerator

let lat = latObj['first'] + latObj['second'] / 60 + latObj['third'] / 3600
}




EXIF.getData(image, () => {
  var date = image.exifdata.DateTime
  console.log(image.exifdata);
  var gpsTemp = [image.exifdata.GPSLatitude, image.exifdata.GPSLongitude]
  var gps = [gpsTemp[0][0].numerator, gpsTemp[0][1].numerator, gpsTemp[0][2].numerator, gpsTemp[1][0].numerator, gpsTemp[1][1].numerator, gpsTemp[1][2].numerator]
  var combined = [gps[0], gps[1]/60, gps[2] / 360000, gps[3], gps[4]/60, gps[5] / 360000]
  this.setState({
    imageDate: date,
    imageLocation: {lat: combined[0] + combined[1] + combined[2], lng: combined[3] + combined[4] + combined[5]}
  })
  console.log(this.state.imageLocation);
  geocoder.reverseGeocode(this.state.imageLocation.lat, this.state.imageLocation.lng, (err, data) => {

    if (err) { console.log(err) }
    console.log(data.results[0])
  })
})
