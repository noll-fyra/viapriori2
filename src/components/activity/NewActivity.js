import React from 'react'
import db, {storage, storageKey} from '../../utils/firebase'
import EXIF from 'exif-js'
import geocoder from 'geocoder'
import latLng, {getLocation} from '../../utils/geocoding'
import Rating from '../rating/Rating'
import moment from 'moment'

class NewActivity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isNewTrip: false,
      newTripName: '',
      trips: [],
      tripIDs: [],
      tripIndex: 0,
      title: '',
      imagePath: '',
      imageName: '',
      imageLatLng: '',
      date: Date.now(),
      caption: '',
      image: '',
      locality: '',
      country: '',
      editLocation: false,
      rating: 0
    }
    this.chooseTrip = this.chooseTrip.bind(this)
    this.startNewTrip = this.startNewTrip.bind(this)
    this.addedTripTitle = this.addedTripTitle.bind(this)
    this.addedActivityTitle = this.addedActivityTitle.bind(this)
    this.addedFile = this.addedFile.bind(this)
    this.changeDate = this.changeDate.bind(this)
    this.changeLocality = this.changeLocality.bind(this)
    this.changeCountry = this.changeCountry.bind(this)
    this.addedCaption = this.addedCaption.bind(this)
    this.starClick = this.starClick.bind(this)
    this.addActivity = this.addActivity.bind(this)
  }

  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value').then((snap) => {
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
      isNewTrip: bool
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
      console.log('exifdata:', image.exifdata)
      let date = Date.now()
      if (image.exifdata.DateTime) {
        date = moment(image.exifdata.DateTime, 'YYYY:MM:DD HH:mm:ss')
      }
      this.setState({
        date: date,
        imageLatLng: {lat: latLng(image).lat, lng: latLng(image).lng}
      })
      if (this.state.imageLatLng.lat && this.state.imageLatLng.lng) {
        geocoder.reverseGeocode(this.state.imageLatLng.lat, this.state.imageLatLng.lng, (err, data) => {
          if (err) { console.log(err) }
          if (data.results[0]) {
            console.log('reverse geocoded address:', data.results[0])
            this.setState({
              locality: getLocation(data.results[0])[0],
              country: getLocation(data.results[0])[1]
            })
          }
        })
      } else {
        this.setState({
          locality: '',
          country: ''
        })
      }
    })
  }

  changeDate (e) {
    this.setState({
      date: moment(e.target.value).valueOf()
    })
  }

  changeLocality (e) {
    this.setState({
      locality: e.target.value
    })
  }

  changeCountry (e) {
    this.setState({
      country: e.target.value
    })
  }

  addedCaption (e) {
    this.setState({
      caption: e.target.value
    })
  }

  starClick (number) {
    this.setState({
      rating: number
    })
  }

  addActivity () {
    // create new trip if isNewTrip is true
    let newTripID = ''
    if (this.state.isNewTrip) {
      let trips = db.ref('trips')
      let newRef = trips.push()
      newTripID = newRef.key
      newRef.set({
        user: window.localStorage[storageKey],
        title: this.state.newTripName,
        image: window.localStorage[storageKey] + '/' + newTripID + '/images/' + this.state.imageName
      })
      db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value', snap => {
        let newObj = snap.val() || {}
        newObj[newTripID] = true
        db.ref('users/' + window.localStorage[storageKey] + '/trips').set(newObj)
      })
    }
    let tripID = this.state.isNewTrip ? newTripID : this.state.tripIDs.reverse()[this.state.tripIndex]
    // save photo
    storage.ref(window.localStorage[storageKey] + '/' + tripID + '/images/' + this.state.imageName).put(this.state.imagePath).then((snap) => {
      // create activity
      let activityRef = db.ref('activities/').push({
        trip: tripID,
        user: window.localStorage[storageKey],
        title: this.state.title,
        date: this.state.date,
        locality: this.state.locality,
        country: this.state.country,
        imageLatLng: this.state.imageLatLng,
        image: window.localStorage[storageKey] + '/' + tripID + '/images/' + this.state.imageName,
        caption: this.state.caption,
        rating: this.state.rating
      })
      let newActivityID = activityRef.key
      db.ref('trips/' + tripID +'/activities').once('value', snap => {
        let newTripObj = snap.val() || {}
        newTripObj[newActivityID] = true
        db.ref('trips/' + tripID+'/activities').set(newTripObj)
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
            {!this.state.isNewTrip &&
            <p>
              <label>
                Add to:
                <select onChange={this.chooseTrip}>
                  {options}
                </select>
              </label>
               or <button onClick={() => this.startNewTrip(true)}>Start a new trip</button>
            </p>
            }
            {this.state.isNewTrip &&
              <p><input type='text' onChange={this.addedTripTitle} placeholder='Add new trip' />
            or <button onClick={() => this.startNewTrip(false)}>add to existing trip</button></p>
            }

            <p>Activity: <input type='text' onChange={(e) => this.addedActivityTitle(e)} placeholder='' /></p>
            <p>Date: <input type='date' onChange={this.changeDate} value={moment(this.state.date).format('YYYY-MM-DD')} /></p>
            <p>City: <input type='text' placeholder='city' onChange={this.changeLocality} value={this.state.locality} /></p>
            <p>Country: <input type='text' placeholder='country' onChange={this.changeCountry} value={this.state.country} /></p>
            <p>Caption: <textarea onChange={(e) => this.addedCaption(e)} /></p>
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
