import React from 'react'
import Details from './Details'
import TripOverview from '../trip/TripOverview'
import Follow from '../follow/Follow'
import db, {storageKey, storage} from '../../utils/firebase'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'user',
      profileImage: require('./profile_by_jivan_from_noun_project.png'),
      keys: [],
      trips: [],
      following: [],
      followed: [],
      isFollowing: false,
      isCurrentUser: props.isCurrentUser,
      currentUser: props.match.params.id || window.localStorage[storageKey],
      showing: 'trips'
    }
    this.addProfileImage = this.addProfileImage.bind(this)
    this.changeShowing = this.changeShowing.bind(this)
    this.handleFollow = this.handleFollow.bind(this)
    this.handleUnfollow = this.handleUnfollow.bind(this)
  }

  componentDidMount () {
    db.ref('users/' + this.state.currentUser).on('value', snapshot => {
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
      // fetch user following
      if (snapshot.val() && snapshot.val().following) {
        let following = Object.keys(snapshot.val().following)
        let users = []
        following.forEach((user) => {
          db.ref('users/' + user).once('value').then((snap) => {
            users.push(snap.val())
            this.setState({
              following: users
            })
          })
        })
      }
      // fetch user followed
      if (snapshot.val() && snapshot.val().followed) {
        let followed = Object.keys(snapshot.val().followed)
        this.setState({
          isFollowing: followed.includes(window.localStorage[storageKey])
        })
        let users = []
        followed.forEach((user) => {
          db.ref('users/' + user).once('value').then((snap) => {
            users.push(snap.val())
            this.setState({
              followed: users
            })
          })
        })
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

  changeShowing (name) {
    this.setState({
      showing: name
    })
  }

  handleFollow () {
    db.ref('users/' + window.localStorage[storageKey] + '/following').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[this.props.match.params.id] = true
      db.ref('users/' + window.localStorage[storageKey] + '/following').set(newObj)
    })
    db.ref('users/' + this.state.currentUser + '/followed').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[window.localStorage[storageKey]] = true
      db.ref('users/' + this.state.currentUser + '/followed').set(newObj)
    })
    this.setState({
      isFollowing: true
    })
  }

  handleUnfollow () {
    db.ref('users/' + this.state.currentUser + '/followed/' + window.localStorage[storageKey]).remove()
    db.ref('users/' + window.localStorage[storageKey] + '/following/' + this.props.match.params.id).remove()
    this.setState({
      isFollowing: false
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
          isCurrentUser={this.state.isCurrentUser}
          changeShowing={this.changeShowing}
          isFollowing={this.state.isFollowing}
          following={this.state.following.length}
          followed={this.state.followed.length}
          handleFollow={this.handleFollow}
          handleUnfollow={this.handleUnfollow}
        />
        {this.state.showing === 'trips' &&
          <div className='trips'>
            {reverseTrips}
          </div>
        }
        {this.state.showing === 'following' &&
          <div className='following'>
            <Follow users={this.state.following} />
          </div>
        }
        {this.state.showing === 'followed' &&
          <div className='followed'>
            <Follow users={this.state.followed} />
          </div>
        }
      </div>
    )
  }
}

export default Profile
