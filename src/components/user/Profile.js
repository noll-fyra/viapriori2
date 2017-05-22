import React from 'react'
import SearchForm from '../search/SearchForm'
import TripItem from '../tripitem/TripItem'
import ProfileDetails from './ProfileDetails'
import search from '../../utils/search'

const profile = [
  'Name',
  'email',
  'age'
]

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userDisplayed: profile,
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
        <ProfileDetails profileDetails={profile} />
        <TripItem tripItems={this.state.tripDisplayed.filter((trip) => { return trip.includes(this.state.searchQuery) })} />
      </div>
    )
  }
}

export default Profile
