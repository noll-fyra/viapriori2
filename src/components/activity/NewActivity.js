import React from 'react'
import db, {storage, storageKey} from '../../utils/firebase'
import EXIF from 'exif-js'
import geocoder from 'geocoder'
import latLng, {getLocation} from '../../utils/geocoding'
import formatDate from '../../utils/format'
import Rating from '../rating/Rating'

class NewActivity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newTrip: false,
      newTripName: '',
      trips: [],
      tripIDs: [],
      tripIndex: 0,
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
    this.chooseTrip = this.chooseTrip.bind(this)
    this.startNewTrip = this.startNewTrip.bind(this)
    this.addedTripTitle = this.addedTripTitle.bind(this)
    this.addedActivityTitle = this.addedActivityTitle.bind(this)
    this.addedFile = this.addedFile.bind(this)
    this.addedDescription = this.addedDescription.bind(this)
    this.starClick = this.starClick.bind(this)
    this.addActivity = this.addActivity.bind(this)
  }

  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value', (snap) => {
      Object.keys(snap.val()).forEach((trip) => {
        this.setState({
          tripIDs: this.state.tripIDs.concat(trip)
        })
        db.ref('trips/' + trip).once('value', (snap) => {
          this.setState({
            trips: this.state.trips.concat(snap.val().title)
          })
        })
      })
    })
  }

  chooseTrip (e) {
    this.setState({
      tripIndex: e.target.selectedIndex
    })
  }

  startNewTrip (bool) {
    this.setState({
      newTrip: bool
    })
  }

  addedTripTitle (e) {
    this.setState({
      newTripName: e.target.value
    })
  }

  addedActivityTitle (e) {
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
    this.setState({
      imagePath: image,
      imageName: image.name
    })

    EXIF.getData(image, () => {
      console.log(image.exifdata)
      let date = Date.now()
      if (image.exifdata.DateTime) {
      // console.log(image.exifdata.DateTime)
      // console.log(formatDate(image.exifdata.DateTime))
        let parsedDate = Date.parse(formatDate(image.exifdata.DateTime))
        let offset = (new Date().getTimezoneOffset()) * 60 * 1000
      // console.log(parsedDate)
      // console.log(parsedDate + offset)
        date = parsedDate + offset
      }
      this.setState({
        date: date,
        imageLatLng: {lat: latLng(image).lat, lng: latLng(image).lng}
      })
      // console.log(image.exifdata)
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
      rating: number
    })
  }

  addActivity () {
    let newTripID = ''
// create new trip if newTrip is true
    if (this.state.newTrip) {
      let trips = db.ref('trips')
      let newRef = trips.push()
      newRef.set({
        user: window.localStorage[storageKey],
        title: this.state.newTripName
      })
      let key = newRef.key
      newTripID = key
      db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value', snap => {
        let newObj = snap.val() || {}
        newObj[key] = true
        db.ref('users/' + window.localStorage[storageKey] + '/trips').set(newObj)
      })
    }
    let tripID = this.state.newTrip ? newTripID : this.state.tripIDs.reverse()[this.state.tripIndex]
// save photo
    storage.ref(window.localStorage[storageKey] + '/' + this.props.tripid + '/images/' + this.state.imageName).put(this.state.imagePath).then((snap) => {
// create activity
      db.ref('activities/').push({
        trip: tripID,
        user: window.localStorage[storageKey],
        title: this.state.title,
        date: this.state.date,
        locality: this.state.locality,
        country: this.state.country,
        imageLatLng: this.state.imageLatLng,
        image: window.localStorage[storageKey] + '/' + this.props.tripid + '/images/' + this.state.imageName,
        description: this.state.description,
        rating: this.state.rating
      })
    })
  }

  render () {
    const temp = this.state.trips.slice().reverse()
    const options = temp.map((title) => {
      return <option key={title}>{title}</option>
    })
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
            {!this.state.newTrip &&
            <p>Add to:
              <select onChange={this.chooseTrip}>
                {options}
              </select> or <button onClick={() => this.startNewTrip(true)}>Start a new trip</button></p>
            }
            {this.state.newTrip &&
              <p><input type='text' onChange={this.addedTripTitle} placeholder='Add new trip' />
            or <button onClick={() => this.startNewTrip(false)}>add to existing trip</button></p>
            }

            <p>Activity: <input type='text' onChange={(e) => this.addedActivityTitle(e)} placeholder='' /></p>
            <p>Date: <b>{new Date(this.state.date).toString()}</b></p>
            {this.state.locality && this.state.country &&
            <p>Location: <b>{this.state.locality + ', ' + this.state.country}</b></p>
            }
            {!this.state.locality && !this.state.country &&
            <p>Location: <input type='text' placeholder='no loc data' /></p>
            }
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

export default NewActivity
