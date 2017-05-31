import React from 'react'
import fixOrientation from 'fix-orientation'
import Details from './Details'
import TripOverview from '../trip/TripOverview'
import db, {storageKey, storage} from '../../utils/firebase'
import updateDB from '../../utils/updateDB'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUser: props.currentUser,
      user: {},
      keys: [],
      trips: [],
      hasUpdatedProfileImage: false,
      updatedProfileImage: require('./profile_by_jivan_from_noun_project.png'),
      isFollowing: false,
      userID: props.match.params.id
    }
    this.addProfileImage = this.addProfileImage.bind(this)
    this.handleFollow = this.handleFollow.bind(this)
    this.handleUnfollow = this.handleUnfollow.bind(this)
  }

  componentDidMount () {
    this.setState({
      isFollowing: this.state.currentUser.following ? this.state.currentUser.following[this.state.userID] !== null : false
    })

    db.ref('users/' + this.state.userID).on('value', snapshot => {
      this.setState({
        user: snapshot.val() || {}
      })
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
      } else {
        this.setState({
          trips: []
        })
      }
    })
  }

  addProfileImage (e) {
    this.setState({
      hasUpdatedProfileImage: true
    })
    let image = e.target.files[0]
    // show user the locally uploaded file
    const reader = new window.FileReader()
    reader.addEventListener('load', () => {
      let self = this
      fixOrientation(reader.result, { image: true }, function (fixed, newImage) {
        self.setState({
          updatedProfileImage: fixed
        })
        // upload the file to firebase
        storage.ref(window.localStorage[storageKey] + '/profile/avatar').putString(self.state.updatedProfileImage, 'data_url').then((snap) => {
          storage.ref(window.localStorage[storageKey] + '/profile/avatar').getDownloadURL().then((url) => {
            // update the profileImage url
            db.ref('users/' + window.localStorage[storageKey] + '/profile').update({
              profileImage: url
            })
          })
        })
      })
    })
    reader.readAsDataURL(image)
  }

  handleFollow () {
    updateDB('users/' + window.localStorage[storageKey] + '/following', this.state.userID, true)
    updateDB('users/' + this.state.userID + '/followers', window.localStorage[storageKey], true)
  }

  handleUnfollow () {
    db.ref('users/' + this.state.userID + '/followers/' + window.localStorage[storageKey]).remove()
    db.ref('users/' + window.localStorage[storageKey] + '/following/' + this.state.userID).remove()
  }

  render () {
    const reverseTrips = this.state.trips.slice().reverse().map((trip, index) => {
      return <TripOverview key={this.state.keys.slice().reverse()[index]} tripID={this.state.keys.slice().reverse()[index]} trip={trip} />
    })
    return (
      <div>
        <Details
          currentUser={this.state.currentUser}
          userID={this.state.userID}
          user={this.state.user}
          hasUpdatedProfileImage={this.state.hasUpdatedProfileImage}
          updatedProfileImage={this.state.updatedProfileImage}
          addProfileImage={this.addProfileImage}
          isFollowing={this.state.isFollowing}
          handleFollow={this.handleFollow}
          handleUnfollow={this.handleUnfollow}
        />
        <div className='trips'>
          {reverseTrips}
        </div>
      </div>
    )
  }
}

export default Profile
