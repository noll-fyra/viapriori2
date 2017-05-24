import React from 'react'
import db, {auth, storage} from '../../utils/firebase'
import EXIF from 'exif-js'
import geocoder from 'geocoder'
import latLng, {getLocation} from '../../utils/geocoding'
import formatDate from '../../utils/format'
import Rating from '../rating/Rating'

class New extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      imagePath: '',
      imageName: '',
      imageLatLng: '',
      date: '',
      description: '',
      image: '',
      locality: '',
      country: '',
      rating: 0
    }
    this.addedTitle = this.addedTitle.bind(this)
    this.addedFile = this.addedFile.bind(this)
    this.addedDescription = this.addedDescription.bind(this)
    this.starClick = this.starClick.bind(this)
    this.addActivity = this.addActivity.bind(this)
  }

  addedTitle (e) {
    this.setState({
      title: e.target.value
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
    console.log(image)
    this.setState({
      imagePath: image,
      imageName: image.name
    })

    EXIF.getData(image, () => {
      // var x = new Date(image.exifdata.DateTime)
      console.log(image.exifdata.DateTime)
      console.log(formatDate(image.exifdata.DateTime))
      let parsedDate = Date.parse(formatDate(image.exifdata.DateTime))
      let offset = (new Date().getTimezoneOffset()) * 60 * 1000
      console.log(parsedDate)
      console.log(parsedDate + offset)
      this.setState({
        date: parsedDate + offset,
        imageLatLng: {lat: latLng(image).lat, lng: latLng(image).lng}
      })
      console.log(image.exifdata)
      if (this.state.imageLatLng.lat && this.state.imageLatLng.lng) {
        geocoder.reverseGeocode(this.state.imageLatLng.lat, this.state.imageLatLng.lng, (err, data) => {
          if (err) { console.log(err) }
          if (data.results[0]) {
            this.setState({
              locality: getLocation(data.results[0])[0],
              country: getLocation(data.results[0])[1]
            })
          }
        })
      }
    })
  }

  addedDescription (e) {
    this.setState({
      description: e.target.value
    })
  }

  starClick (number) {
    this.setState({
      stars: number
    })
  }

  addActivity () {
    console.log(this.state.imagePath)
    storage.ref(auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName).put(this.state.imagePath).then((snap) => {
      // console.log(snap.val());
      db.ref('activities/').push({
        trip: this.props.tripid,
        section: 5,
        user: auth.currentUser.uid,
        title: this.state.title,
        date: this.state.date,
        locality: this.state.locality,
        country: this.state.country,
        imageLatLng: this.state.imageLatLng,
        image: auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName,
        description: this.state.description,
        rating: this.state.rating
      })
    })
  }

  render () {
    return (
      <div className='modalWrapper'>
        <div className='backdrop' onClick={this.props.onClose} />

        {this.state.imagePath === '' &&
        <div className='modal'>
          <label className='imageLabel'>
            <span>Post a photo</span>
            <input className='fileInput' type='file' onChange={(e) => this.addedFile(e)} />
          </label>
        </div>
        }

        {this.state.imagePath !== '' &&
        <div >

          <div className='modal'>
            <label className='imageLabelActive' style={{backgroundImage: `url(${this.state.image})`, backgroundSize: 'cover'}}>
              <span>Post a photo</span>
              <input className='fileInput' type='file' onChange={(e) => this.addedFile(e)} />
            </label>
          </div>
          <div className='modal modal2'>
            <p>Activity: <input type='text' onChange={(e) => this.addedTitle(e)} placeholder='' /></p>
            <p>Date: <b>{new Date(this.state.date).toString()}</b></p>
            <p>Location: <b>{this.state.locality + ', ' + this.state.country}</b></p>
            <p>Caption: <textarea onChange={(e) => this.addedDescription(e)} /></p>
            <Rating stars={this.state.rating} starClick={this.starClick} />
            <button onClick={this.addActivity}>Share</button>
          </div>
        </div>
        }
      </div>
    )
  }
}

export default New
