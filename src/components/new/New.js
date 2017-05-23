import React from 'react'
import db, {auth, storage} from '../../utils/firebase'
import EXIF from 'exif-js'
import geocoder from 'geocoder'

class New extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      imagePath: '',
      imageName: 'Add an image',
      imageLocation: '',
      imageDate: '',
      description: '',
      image: ''
    }
    this.addedTitle = this.addedTitle.bind(this)
    this.addedStart = this.addedStart.bind(this)
    this.addedEnd = this.addedEnd.bind(this)
    this.addedFile = this.addedFile.bind(this)
    this.addedDescription = this.addedDescription.bind(this)
    this.addActivity = this.addActivity.bind(this)
  }

  addedTitle (e) {
    this.setState({
      title: e.target.value
    })
  }

  addedStart (e) {
    this.setState({
      start: e.target.value
    })
  }

  addedEnd (e) {
    this.setState({
      end: e.target.value
    })
  }

  addedFile (e) {
    let image = e.target.files[0]
    var reader = new window.FileReader()
    reader.addEventListener('load', () => {
      this.setState({
        image: reader.result
      })
    })
    reader.readAsDataURL(image)

    this.setState({
      imagePath: image,
      imageName: image.name
    })

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
  }

  addedDescription (e) {
    this.setState({
      description: e.target.value
    })
  }

  addActivity () {
    console.log(this.state.imagePath)
    storage.ref(auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName).put(this.state.imagePath).then((snap) => {
      db.ref('trips/' + auth.currentUser.uid + '/' + this.props.tripid + '/sections').push({
        title: this.state.title,
        start: this.state.start,
        end: this.state.end,
        image: auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName,
        description: this.state.description
      })
    })
  }

  render () {
    return (
      <div>
        <div className='backdrop' onClick={this.props.onClose} />

        {this.state.imagePath === '' &&
        <div className='modal'>
          <label>
            <span>{this.state.imageName}</span>
            <input className='fileInput' type='file' onChange={(e) => this.addedFile(e)} />
          </label>
        </div>
        }

        {this.state.imagePath !== '' &&
        <div>

          <div className='modal' style={{backgroundImage: `url(${this.state.image})`, backgroundSize: 'cover'}}>
            {/* <img src={this.state.image} alt='' /> */}

          </div>
          <div className='modal modal2'>
            <p><input type='text' onChange={(e) => this.addedTitle(e)} placeholder='Title' /></p>
            <p><input type='date' onChange={(e) => this.addedStart(e)} /></p>
            <p><input type='date' onChange={(e) => this.addedEnd(e)} /></p>
            <p><textarea onChange={(e) => this.addedDescription(e)} /></p>
            <button onClick={this.addActivity}>Post</button>
          </div>
        </div>
        }
      </div>
    )
  }
}

export default New
