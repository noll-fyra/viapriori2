import React from 'react'
import Details from './Details'
import TripOverview from '../trip/TripOverview'
import db, {storageKey, storage} from '../../utils/firebase'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'user',
      profileImage: require('./profile_by_jivan_from_noun_project.png'),
      keys: [],
      trips: []
    }
    this.addProfileImage = this.addProfileImage.bind(this)
  }

  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
      // fetch user profile
      if (snapshot.val() && snapshot.val().profile) {
        this.setState({
          username: snapshot.val().profile.username || this.state.username,
          profileImage: snapshot.val().profile.profileImage || this.state.profileImage
        })
      }
      // fetch user trips
      if (snapshot.val() && snapshot.val().trips) {
        let keys = Object.keys(snapshot.val().trips)
        this.setState({
          keys: keys
        })
        let trips = keys.slice()
        for (var key in snapshot.val().trips) {
          let ind = keys.indexOf(key)
          db.ref('trips/' + key).once('value').then((snap) => {
            trips[ind] = snap.val()
            this.setState({
              trips: trips
            })
          })
        }
      }
    })
  }

  addProfileImage (e) {
    let image = e.target.files[0]

    // show user the locally uploaded file
    const reader = new window.FileReader()
    reader.addEventListener('load', () => {
      this.setState({
        profileImage: reader.result
      })
    })
    reader.readAsDataURL(image)

    // upload the file to firebase
    storage.ref(window.localStorage[storageKey] + '/profile/avatar').put(image).then((snap) => {
      storage.ref(window.localStorage[storageKey] + '/profile/avatar').getDownloadURL().then((url) => {
        // update the profileImage url
        db.ref('users/' + window.localStorage[storageKey] + '/profile').update({
          profileImage: url
        })
      })
    })
  }

  render () {
    const reverseTrips = this.state.trips.slice().reverse().map((trip, index) => {
      return <TripOverview key={this.state.keys.slice().reverse()[index]} tripID={this.state.keys.slice().reverse()[index]} trip={trip} />
    })
    return (
      <div>
        <Details
          username={this.state.username}
          profileImage={this.state.profileImage}
          numberOfTrips={this.state.trips.length}
          addProfileImage={this.addProfileImage}
        />
        <div className='trips'>
          {reverseTrips}
        </div>
      </div>
    )
  }
}

export default Profile
