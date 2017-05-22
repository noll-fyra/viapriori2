import React from 'react'
import SearchForm from '../search/SearchForm'
import TripItem from '../tripitem/TripItem'

const trips = [
  'Vietnam',
  'Taiwan',
  'Japan'
]

class TripList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tripDisplayed: trips
    }
  }

  tripSearch (e) {
    let searchQuery = e.target.value.toLowerCase()
    this.setState((prevState, props) => {
      let searchedTrips = trips.filter((trip) => {
        let lowercaseTrip = trip.toLowerCase()
        return lowercaseTrip.includes(searchQuery)

    // to add in the filters for the other properties of trips(activities name/User name, when database tables are up)
      })
      return {
        tripDisplayed: searchedTrips
      }
    })
  }

  tripDetails (e) {
    let tripDisplayed = this.state.tripDisplayed
    let index = e.target.getAttribute('name')
    let selectedTrip = tripDisplayed[index]

  // let searchQuery = e.target.value.toLowerCase()
    this.setState((prevState, props) => {
      let selectedTrips = props.trips.filter((trip) => {
        let lowercaseTrip = trip.toLowerCase()
        return lowercaseTrip.includes(selectedTrip)
      })
      return {
        tripDetails: selectedTrips
      }
    })
  }

  render () {
    return (
      <div>
        <SearchForm onChange={(e) => this.tripSearch(e)} />
        <h1> Featured Trips</h1>
        {this.state.tripDisplayed &&
          <TripItem tripItems={this.state.tripDisplayed} tripDetails={(e) => this.tripDetails(e)} />
        }
        {this.state.tripDetails}
      </div>
    )
  }
}

export default TripList
