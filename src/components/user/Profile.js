import React from 'react'
// import db, {auth} from '../../utils/firebase'
import search from '../../utils/search'
import SearchForm from '../search/SearchForm'
import TripItem from '../tripitem/TripItem'
// import ProfileDetails from './ProfileDetails'
// import Nav from '../nav/Nav'
// import Trips from '../trip/Trips'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userDisplayed: 'asd',
      tripDisplayed: ['america', 'russia', 'iceland'],
      searchQuery: ''
    }

    this.search = search.bind(this)
  }

  render () {
    return (
      <div>
        <SearchForm onChange={(e) => this.search(e)} />
        <h1> User Profile</h1>
        {/* <ProfileDetails profileDetails={profile} /> */}
        <TripItem tripItems={this.state.tripDisplayed.filter((trip) => { return trip.includes(this.state.searchQuery) })} />
        {/* <Trips/> */}
      </div>
    )
  }
}

export default Profile
