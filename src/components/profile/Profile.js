import React from 'react'
import Details from './Details'
import TripOverview from '../trip/TripOverview'
import './profile.css'
import db, {storageKey} from '../../utils/firebase'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUser: props.currentUser,
      user: {},
      keys: [],
      trips: [],
      userID: props.match.params.id || window.localStorage[storageKey]
    }
  }

  componentDidMount () {
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

  render () {
    const reverseTrips = this.state.trips.slice().reverse().map((trip, index) => {
      return <TripOverview key={this.state.keys.slice().reverse()[index]} tripID={this.state.keys.slice().reverse()[index]} trip={trip} />
    })
    return (
      <div className='profilecontainer'>

        <Details
          currentUser={this.state.currentUser}
          userID={this.state.userID}
          user={this.state.user}
          hasUpdatedProfileImage={this.state.hasUpdatedProfileImage}
          type='profile'
        />
        <div className='trips'>
          {reverseTrips}
        </div>
      </div>
    )
  }
}

export default Profile
