import React from 'react'
// import db, {auth} from '../../utils/firebase'
// import search from '../../utils/search'
// import SearchForm from '../search/SearchForm'
import TripOverview from '../trip/TripOverview'
// import ProfileDetails from './ProfileDetails'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userDisplayed: 'asd',
      tripDisplayed: ['america', 'russia', 'iceland'],
      searchQuery: ''
    }
    // this.search = search.bind(this)
  }

  render () {
    const trips = this.state.tripDisplayed.filter((trip) => { return trip.includes(this.state.searchQuery) })
    return (
      <div>
        <h1> User Profile</h1>
        {/* <ProfileDetails profileDetails={profile} /> */}
        {/* <TripOverview tripItems={trips} /> */}
      </div>
    )
  }
}

export default Profile
