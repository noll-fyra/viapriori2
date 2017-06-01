import React from 'react'
import {Link} from 'react-router-dom'
import EXIF from 'exif-js'
import geocoder from 'geocoder'
import moment from 'moment'
import Loading from 'react-loading'
import fixOrientation from 'fix-orientation'
import { WithContext as ReactTags } from 'react-tag-input'
import Flash from '../flash/Flash'
import Rating from '../rating/Rating'
import db, {storage, storageKey} from '../../utils/firebase'
import latLng, {getLocation} from '../../utils/geocoding'
import tagsArrayToObject from '../../utils/format'
import updateDB, {updateDBPlusOne} from '../../utils/updateDB'
import './tags.css'
import './modal.css'

class NewActivity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false,
      message: '',
      isNewTrip: false,
      newTripTitle: '',
      trips: [],
      tripID: '',
      tripIndex: 0,
      title: '',
      imageName: '',
      imageOrientation: 1,
      imageLatLng: '',
      date: Date.now(),
      caption: '',
      image: '',
      locality: '',
      country: '',
      rating: 0,
      tags: [],
      suggestions: props.suggestions,
      isUploading: false
    }

    this.handleFile = this.handleFile.bind(this)
    this.chooseTrip = this.chooseTrip.bind(this)
    this.startNewTrip = this.startNewTrip.bind(this)
    this.handleTripTitle = this.handleTripTitle.bind(this)
    this.handleActivityTitle = this.handleActivityTitle.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.handleLocality = this.handleLocality.bind(this)
    this.handleCountry = this.handleCountry.bind(this)
    this.handleCaption = this.handleCaption.bind(this)
    this.starClick = this.starClick.bind(this)
    this.handleTagDelete = this.handleTagDelete.bind(this)
    this.handleTagAddition = this.handleTagAddition.bind(this)
    this.hasErrors = this.hasErrors.bind(this)
    this.handleActivity = this.handleActivity.bind(this)
    this.resetState = this.resetState.bind(this)
    this.linkToTrip = null
  }

  componentDidMount () {
    // get all the user's trips
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value').then((snapshot) => {
      if (!snapshot.val()) {
        this.setState({
          isNewTrip: true
        })
      }
      let keys = snapshot.val() ? Object.keys(snapshot.val()) : []
      let trips = []
      keys.forEach((key, index) => {
        db.ref('trips/' + key).once('value').then((snap) => {
          trips.push([keys[index], snap.val()])
          this.setState({
            trips: trips
          })
        })
      })
    })
  }

  handleFile (e) {
    // show loading animation
    this.setState({
      isUploading: true
    })
    // show file preview
    let image = e.target.files[0]
    var reader = new window.FileReader()
    reader.addEventListener('load', () => {
      let self = this
      fixOrientation(reader.result, { image: true }, function (fixed, newImage) {
        self.setState({
          image: fixed
        })
      })
    })
    reader.readAsDataURL(image)
    this.setState({
      imageName: image.name
    })

    // get EXIF data for orientation, date and gps
    EXIF.getData(image, () => {
      console.log('exifdata:', image.exifdata)
      let date = image.exifdata.DateTime ? moment(image.exifdata.DateTime, 'YYYY:MM:DD HH:mm:ss').valueOf() : Date.now()
      let orientation = image.exifdata.Orientation || 1
      this.setState({
        date: date,
        imageLatLng: {lat: latLng(image).lat, lng: latLng(image).lng},
        imageOrientation: orientation
      })
      // find locality and country from gps data
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
      } else {
        this.setState({
          locality: '',
          country: ''
        })
      }
    })
    // stop loading animation
    this.setState({
      isUploading: false
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

  handleTripTitle (e) {
    this.setState({
      newTripTitle: e.target.value
    })
  }

  handleActivityTitle (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleDate (e) {
    this.setState({
      date: moment(e.target.value).valueOf()
    })
  }

  handleLocality (e) {
    this.setState({
      locality: e.target.value
    })
  }

  handleCountry (e) {
    this.setState({
      country: e.target.value
    })
  }

  handleCaption (e) {
    this.setState({
      caption: e.target.value
    })
  }

  starClick (number) {
    this.setState({
      rating: number
    })
  }

  handleTagDelete (i) {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({tags: tags})
  }

  handleTagAddition (tag) {
    let tags = this.state.tags
    tags.push({
      id: tags.length + 1,
      text: tag
    })
    this.setState({tags: tags})
  }

  hasErrors () {
    let self = this
    let hasErrors = false
    function errorMessage (message) {
      self.setState({
        error: true,
        message: message
      })
      hasErrors = true
    }
    if (!this.state.locality || !this.state.country) {
      errorMessage('Both city and country are required')
    }
    if (!this.state.title) {
      errorMessage('A valid activity name is required')
    }
    if (!this.state.date) {
      errorMessage('A valid date is required')
    }
    if (!this.state.newTripTitle && this.state.isNewTrip) {
      errorMessage('A trip title is required')
    }
    return hasErrors
  }

  resetState () {
    this.setState({
      error: false,
      message: '',
      isNewTrip: false,
      newTripTitle: '',
      tripIndex: 0,
      title: '',
      imageName: '',
      imageOrientation: 1,
      imageLatLng: '',
      date: Date.now(),
      caption: '',
      image: '',
      locality: '',
      country: '',
      rating: 0,
      tags: [],
      isUploading: false
    })
    // get all the user's trips
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value').then((snapshot) => {
      if (!snapshot.val()) {
        this.setState({
          isNewTrip: true
        })
      }
      let keys = Object.keys(snapshot.val())
      let trips = []
      keys.forEach((key, index) => {
        db.ref('trips/' + key).once('value').then((snap) => {
          trips.push([keys[index], snap.val()])
          this.setState({
            trips: trips
          })
        })
      })
    })
  }

  handleActivity () {
    if (this.hasErrors()) {
      return
    } else {
    // show loading animation
      this.setState({
        isUploading: true
      })
    // create new trip if isNewTrip is true
      let newTripID = ''
      if (this.state.isNewTrip) {
        let trips = db.ref('trips')
        let newRef = trips.push()
        newTripID = newRef.key
        newRef.set({
          user: window.localStorage[storageKey],
          title: this.state.newTripTitle,
          image: window.localStorage[storageKey] + '/' + newTripID + '/images/' + this.state.imageName,
          imageOrientation: this.state.imageOrientation,
          totalRating: 0,
          start: this.state.date,
          end: this.state.date
        })
      // add new trip to the user's trips and set activity count to 1
        updateDB('users/' + window.localStorage[storageKey] + '/trips', newTripID, 1)
      } else {
      // update existing trip and set activity count + 1
        updateDBPlusOne('users/' + window.localStorage[storageKey] + '/trips', newTripID)
      }
    // update the tripID
      let tripID = this.state.isNewTrip ? newTripID : this.state.trips.slice()[this.state.tripIndex][0]
      this.setState({
        tripID: tripID
      })
    // save photo
      storage.ref(window.localStorage[storageKey] + '/' + tripID + '/images/' + this.state.imageName).putString(this.state.image, 'data_url').then(() => {
      // get image url
        storage.ref(window.localStorage[storageKey] + '/' + tripID + '/images/' + this.state.imageName).getDownloadURL().then((url) => {
        // update new trip image url
          if (this.state.isNewTrip) {
            db.ref('trips/' + newTripID).update({image: url})
          }
        // create activity
          let activityRef = db.ref('activities/').push()
          let newActivityID = activityRef.key
          activityRef.set({
            trip: this.state.tripID,
            user: window.localStorage[storageKey],
            title: this.state.title,
            date: this.state.date,
            locality: this.state.locality,
            country: this.state.country,
            imageLatLng: this.state.imageLatLng,
            image: url,
            imageOrientation: this.state.imageOrientation,
            caption: this.state.caption,
            rating: this.state.rating,
            tags: tagsArrayToObject(this.state.tags)
          })

        // update the trip's activities, rating and date
          db.ref('trips/' + tripID).once('value').then((snap) => {
            let newObj = snap.val() || {}
            let currentActivities = snap.val().activities || {}
            currentActivities[newActivityID] = this.state.isNewTrip ? 0 : snap.val() && snap.val().activities ? Object.keys(snap.val().activities).length : 0
            newObj['activities'] = currentActivities

            let currentRating = snap.val().totalRating || 0
            newObj['totalRating'] = currentRating + this.state.rating
            let currentStart = snap.val().start
            let currentEnd = snap.val().end
            newObj['start'] = currentStart < this.state.date ? currentStart : this.state.date
            newObj['end'] = currentEnd > this.state.date ? currentEnd : this.state.date

            db.ref('trips/' + tripID).set(newObj)
          })

        // add tags to all and trending
          .then(() => {
            this.state.tags.forEach((tag) => {
              let lowerTag = tag.text.toLowerCase()
              updateDBPlusOne('all/tags/', lowerTag)
              updateDBPlusOne('trending/tags/' + moment().format('dddd'), lowerTag)
            })

        // add locality and country to all and trending
            let lowerLocality = this.state.locality
            updateDBPlusOne('all/localities/', lowerLocality)
            updateDBPlusOne('trending/localities/' + moment().format('dddd'), lowerLocality)

            let lowerCountry = this.state.country
            updateDBPlusOne('all/countries/', lowerCountry)
            updateDBPlusOne('trending/countries/' + moment().format('dddd'), lowerCountry)

          // stop loading animation
            this.setState({
              isUploading: false
            })
          })
        .then(() => {
          this.resetState()
          this.props.addNewActivity(false)
          this.linkToTrip.handleClick(new window.MouseEvent('click'))
        })
        })
      })
    }
  }

  render () {
    const options = this.state.trips.slice().map((trip, index) => {
      return <option key={index}>{trip[1].title}</option>
    })
    return (
      <div className='modalContainer' style={this.props.isEnabled ? {display: 'block'} : {display: 'none'}}>
        <div className='backdrop' onClick={() => this.props.addNewActivity(false)} />
        {this.state.image === '' &&
        <div className='modalWrapper'>
          <div />
          <div className='modal'>
            <label className='imageLabel'>
              <span className='postAPhoto'>Post a photo</span>
              <input className='fileInput' type='file' onChange={(e) => this.handleFile(e)} accept={'image/*'} />
            </label>
          </div>
          <div />
        </div>
        }
        {this.state.image !== '' &&
        <div className='modalWrapper'>
          <div>
            <Link to={'/trips/' + this.state.tripID} style={{display: 'none'}} onClick={() => this.props.setCurrentTrip(this.state.tripID)} ref={(link) => { this.linkToTrip = link }} />
          </div>
          <div className='modal1'>
            <Loading className={this.state.isUploading ? 'uploading' : 'notUploading'} type={'spinningBubbles'} color={'blue'} height='63%' width='66.67%' />
            <div className='modal2'>
              <label className='imageLabelActive' style={{backgroundImage: `url(${this.state.image})`, objectFit: 'cover', backgroundSize: 'cover'}}>
                <span className='postAPhoto'>Post a photo</span>
                <input className='fileInput' type='file' onChange={(e) => this.handleFile(e)} accept={'image/*'} />
              </label>
            </div>
            <div className='modal3'>
              {this.state.error &&
              <Flash message={this.state.message} />
            }
              {this.state.trips.length === 0 &&
              <div><input type='text' onChange={this.handleTripTitle} placeholder='Add your first trip' /></div>
            }

              {!this.state.isNewTrip && this.state.trips.length > 0 &&
              <div className='selectTrip'>
                <label>
                Add to:
                <select onChange={this.chooseTrip}>
                  {options}
                </select>
                </label>
                {' '} or <button onClick={() => this.startNewTrip(true)}>Start a new trip</button>
              </div>
            }

              {this.state.isNewTrip && this.state.trips.length > 0 &&
              <div className='selectTrip'>
                <input type='text' onChange={this.handleTripTitle} placeholder='Add new trip' />
                {' '}or <button onClick={() => this.startNewTrip(false)}>Add to existing trip</button>
              </div>
            }
              <div>Activity: <input type='text' onChange={(e) => this.handleActivityTitle(e)} />{' '}</div>
              <div>{' '}Date:{' '}<input type='date' onChange={this.handleDate} value={moment(this.state.date).format('YYYY-MM-DD')} /> {' '}</div>
              <div>{' '}City:{' '}<input type='text' onChange={this.handleLocality} value={this.state.locality} />{' '}</div>
              <div>Country: <input type='text' onChange={this.handleCountry} value={this.state.country} />{' '}</div>
              <div className='caption'>Caption: <textarea onChange={(e) => this.handleCaption(e)} /></div>
              <Rating stars={this.state.rating} starClick={this.starClick} isEnabled />
              <div className='tags'><ReactTags tags={this.state.tags}
                suggestions={this.state.suggestions}
                handleDelete={this.handleTagDelete}
                handleAddition={this.handleTagAddition}
                autofocus={false}
                placeholder='Add tags (press enter to save)'
             /></div>
              <button className='share' onClick={this.handleActivity}>Share</button>
            </div>
            <div />
          </div>
          <div />
        </div>
        }
        <div />
        <div />
      </div>
    )
  }
}

export default NewActivity
