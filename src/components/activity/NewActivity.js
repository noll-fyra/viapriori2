import React from 'react'
import {Link} from 'react-router-dom'
import EXIF from 'exif-js'
import geocoder from 'geocoder'
import moment from 'moment'
import db, {storage, storageKey} from '../../utils/firebase'
import latLng, {getLocation} from '../../utils/geocoding'
import tagsArrayToObject from '../../utils/format'
import Rating from '../rating/Rating'
import fixOrientation from 'fix-orientation'
import { WithContext as ReactTags } from 'react-tag-input'

class NewActivity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isNewTrip: false,
      newTripName: '',
      trips: [],
      tripID: '',
      tripIDs: [],
      tripIndex: 0,
      title: '',
      imagePath: '',
      imageName: '',
      imageOrientation: 1,
      imageLatLng: '',
      date: Date.now(),
      caption: '',
      image: '',
      locality: '',
      country: '',
      editLocation: false,
      rating: 0,
      tags: [],
      suggestions: props.suggestions
    }

    this.chooseTrip = this.chooseTrip.bind(this)
    this.startNewTrip = this.startNewTrip.bind(this)
    this.handleTripTitle = this.handleTripTitle.bind(this)
    this.handleActivityTitle = this.handleActivityTitle.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.handleLocality = this.handleLocality.bind(this)
    this.handleCountry = this.handleCountry.bind(this)
    this.handleCaption = this.handleCaption.bind(this)
    this.starClick = this.starClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleActivity = this.handleActivity.bind(this)
    this.linkToTrip = null
  }

  componentDidMount () {
    // get all the user's trip IDs
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value').then((snapshot) => {
      let keys = snapshot.val() ? Object.keys(snapshot.val()) : []
      this.setState({
        tripIDs: keys
      })
      if (keys.length === 0) {
        this.setState({
          isNewTrip: true
        })
      }
      // get all the trips' details
      let trips = new Array(keys.length).fill(null)
      keys.forEach((trip, index) => {
        db.ref('trips/' + trip).once('value').then((snap) => {
          trips[index] = snap.val().title
          this.setState({
            trips: trips
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

  handleTripTitle (e) {
    this.setState({
      newTripName: e.target.value
    })
  }

  handleActivityTitle (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleFile (e) {
    let image = e.target.files[0]
    var reader = new window.FileReader()
    reader.addEventListener('load', () => {
      let self = this
      fixOrientation(reader.result, { image: true }, function (fixed, image) {
        self.setState({
          image: fixed
        })
      })
    })
    reader.readAsDataURL(image)
    this.setState({
      imagePath: image,
      imageName: image.name
    })

    EXIF.getData(image, () => {
      console.log('exifdata:', image.exifdata)
      let date = image.exifdata.DateTime ? moment(image.exifdata.DateTime, 'YYYY:MM:DD HH:mm:ss').valueOf() : Date.now()
      let orientation = image.exifdata.Orientation || 1
      this.setState({
        date: date,
        imageLatLng: {lat: latLng(image).lat, lng: latLng(image).lng},
        imageOrientation: orientation
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
    this.activityInput.focus()
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

  handleDelete (i) {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({tags: tags})
  }

  handleAddition (tag) {
    let tags = this.state.tags
    tags.push({
      id: tags.length + 1,
      text: tag
    })
    this.setState({tags: tags})
  }

  handleActivity () {
    // create new trip if isNewTrip is true
    let newTripID = ''
    if (this.state.isNewTrip) {
      let trips = db.ref('trips')
      let newRef = trips.push()
      newTripID = newRef.key
      newRef.set({
        user: window.localStorage[storageKey],
        title: this.state.newTripName,
        image: window.localStorage[storageKey] + '/' + newTripID + '/images/' + this.state.imageName,
        imageOrientation: this.state.imageOrientation,
        totalRating: 0,
        start: this.state.date,
        end: this.state.date
      })
      // add new trip to the user's trips
      db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value', snap => {
        let newObj = snap.val() || {}
        newObj[newTripID] = true
        db.ref('users/' + window.localStorage[storageKey] + '/trips').set(newObj)
      })
    }
    // update the tripID
    let tripID = this.state.isNewTrip ? newTripID : this.state.tripIDs.reverse()[this.state.tripIndex]
    this.setState({
      tripID: tripID
    })
    // save photo
    storage.ref(window.localStorage[storageKey] + '/' + tripID + '/images/' + this.state.imageName).put(this.state.imagePath).then(() => {
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
          currentActivities[newActivityID] = true
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
        this.state.tags.forEach((tag) => {
          db.ref('all/tags/' + tag.text).once('value').then((snap) => {
            db.ref('all/tags/' + tag.text).set(snap.val() + 1 || 1)
          })
          db.ref('trending/tags/' + moment().format('dddd') + '/' + tag.text).once('value').then((snap) => {
            db.ref('trending/tags/' + moment().format('dddd') + '/' + tag.text).set(snap.val() + 1 || 1)
          })
        })

        // add locality and country to all and trending
        db.ref('all/localities/' + this.state.locality).once('value').then((snap) => {
          db.ref('all/localities/' + this.state.locality).set(snap.val() + 1 || 1)
        })
        db.ref('trending/localities/' + moment().format('dddd') + '/' + this.state.locality).once('value').then((snap) => {
          db.ref('trending/localities/' + moment().format('dddd') + '/' + this.state.locality).set(snap.val() + 1 || 1)
        })
        db.ref('all/countries/' + this.state.country).once('value').then((snap) => {
          db.ref('all/countries/' + this.state.country).set(snap.val() + 1 || 1)
        })
        db.ref('trending/countries/' + moment().format('dddd') + '/' + this.state.country).once('value').then((snap) => {
          db.ref('trending/countries/' + moment().format('dddd') + '/' + this.state.country).set(snap.val() + 1 || 1)
        })

        this.props.addNewActivity(false)
        this.linkToTrip.handleClick(new window.MouseEvent('click'))
      })
    })
  }

  render () {
    const temp = this.state.trips.slice().reverse()
    const options = temp.map((title, index) => {
      return <option key={index}>{title}</option>
    })
    return (

      <div className='modalWrapper' style={this.props.isEnabled ? {display: 'block'} : {display: 'none'}}>
        <div className='backdrop' onClick={() => this.props.addNewActivity(false)} />

        {this.state.imagePath === '' &&
        <div className='modal'>
          <label className='imageLabel'>
            <span>Post a photo</span>
            <input className='fileInput' type='file' onChange={(e) => this.handleFile(e)} />
          </label>
        </div>
        }

        {this.state.imagePath !== '' &&
        <div >
          <div className='modal'>
            <label className='imageLabelActive' style={{backgroundImage: `url(${this.state.image})`, backgroundSize: 'cover'}}>
              <span>Post a photo</span>
              <input className='fileInput' type='file' onChange={(e) => this.handleFile(e)} />
            </label>
          </div>
          <div className='modal modal2'>
            {this.state.trips.length === 0 &&
              <p><input type='text' onChange={this.handleTripTitle} placeholder='Add your first trip' /></p>
            }
            {!this.state.isNewTrip && this.state.trips.length > 0 &&
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
            {this.state.isNewTrip && this.state.trips.length > 0 &&
              <p><input type='text' onChange={this.handleTripTitle} placeholder='Add new trip' />
            or <button onClick={() => this.startNewTrip(false)}>Add to existing trip</button></p>
            }

            <p>Activity: <input type='text' onChange={(e) => this.handleActivityTitle(e)} ref={(input) => { this.activityInput = input }} /></p>
            <p>Date: <input type='date' onChange={this.handleDate} value={moment(this.state.date).format('YYYY-MM-DD')} /></p>
            <p>City: <input type='text' onChange={this.handleLocality} value={this.state.locality} /></p>
            <p>Country: <input type='text' onChange={this.handleCountry} value={this.state.country} /></p>
            <p>Caption: <textarea onChange={(e) => this.handleCaption(e)} /></p>
            <Rating stars={this.state.rating} starClick={this.starClick} isEnabled />
            <ReactTags tags={this.state.tags}
              suggestions={this.state.suggestions}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              autofocus={false}
              // minQueryLength={1}
             />
            <button onClick={this.handleActivity}>Share</button>
          </div>
        </div>
        }
        <Link to={'/trips/' + this.state.trips.slice().reverse()[this.state.tripIndex] + '/' + this.state.tripID} style={{display: 'none'}} ref={(link) => { this.linkToTrip = link }} />
      </div>
    )
  }
}

export default NewActivity
