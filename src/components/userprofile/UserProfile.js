import React from 'react'
import TripSearchForm from '../tripsearchform/TripSearchForm'
import TripItem from '../tripitem/TripItem'
import UserProfileDetails from '../userprofiledetails/UserProfileDetails'

const profile = [
  'Name',
  'email',
  'age'
]

class UserProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userDisplayed: profile,
      tripDisplayed: ['america', 'russia', 'iceland'],
      userTrips: ['america', 'russia', 'iceland']
    }
  }

  tripSearch (e) {
    let searchQuery = e.target.value.toLowerCase()
    this.setState((prevState, props) => {
      let searchedTrips = prevState.userTrips.filter((trip) => {
        let lowercaseTrip = trip.toLowerCase()
        return lowercaseTrip.includes(searchQuery)
      })
      return {
        tripDisplayed: searchedTrips
      }
    })
  }

  render () {
    return (
      <div>

        <TripSearchForm handleSearch={
          (e) => this.tripSearch(e)
        } />
        <h1> User Profile</h1>
        <UserProfileDetails profileDetails={profile} />
        <TripItem tripItems={this.state.tripDisplayed} />
      </div>
    )
  }
}

export default UserProfile
