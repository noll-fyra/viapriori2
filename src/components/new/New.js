import React from 'react'
import db, {auth, storage} from '../../utils/firebase'
import EXIF from 'exif-js'
import geocoder from 'geocoder'
import latLng, {location} from '../../utils/geocoding'
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
      location: '',
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
      this.setState({
        date: formatDate(image.exifdata.DateTime),
        imageLatLng: {lat: latLng(image).lat, lng: latLng(image).lng}
      })
      // console.log(image.exifdata)
      if (this.state.imageLatLng.lat && this.state.imageLatLng.lng) {
        geocoder.reverseGeocode(this.state.imageLatLng.lat, this.state.imageLatLng.lng, (err, data) => {
          if (err) { console.log(err) }
          if (data.results[0]) {
            let loc = location(data.results[0])[0] + ', ' + location(data.results[0])[1]
            this.setState({
              location: loc
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
      db.ref('activities/').push({
        trip: this.props.tripid,
        section: 5,
        user: auth.currentUser.uid,
        title: this.state.title,
        date: this.state.date,
        location: this.state.location,
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
            <p>Date: <b>{this.state.date}</b></p>
            <p>Location: <b>{this.state.location}</b></p>
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
