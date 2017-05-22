import React from 'react'
import TripSearchForm from '../tripsearchform/TripSearchForm'
import TripItem from '../tripitem/TripItem'
import db, {auth} from '../../utils/firebase'

class TripList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      database: {}
    }
  }

  componentDidMount () {
    db.ref('trips').on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
    })
  }

  displayAllTrips () {
  // const keys = []
  // const details = []
  // for (var key in this.state.database) {
  //   keys.push(key)
  //   details.push(this.state.database[key])
  // }
  // console.log(details, 'hi')
  }

  tripSearch (e) {
  // console.log(this.state.database)
    let searchQuery = e.target.value.toLowerCase()
    const keys = []
    const details = []
    for (var key in this.state.database) {
      keys.push(key)
      details.push(this.state.database[key])
    }

    this.setState((prevState, props) => {
    // to edit details.tripName to field in the database
      let searchedTrips = details.tripName.filter((trip) => {
        let lowercaseTrip = trip.toLowerCase()
        return lowercaseTrip.includes(searchQuery)

    // to add in the filters for the other properties of trips(activities name/User name, when database tables are up)
      })
      return {
        allTrips: details,
        tripSearch: searchedTrips
      }
  // console.log(this.state.tripSearch)
    })
  }

  tripDetails (e) {
  // console.log(key)

    let tripDisplayed = this.state.tripSearch
    let index = e.target.getAttribute('name')
    let selectedTrip = tripDisplayed[index]

  // let searchQuery = e.target.value.toLowerCase()

    this.setState((prevState, props) => {
      let selectedTrips = this.state.tripSearch.filter((trip) => {
        let lowercaseTrip = trip.toLowerCase()
        return lowercaseTrip.includes(selectedTrip)
      })
      return {
        tripSearch: selectedTrip
      }
    })
  }
//

  render () {
    return (
      <div>
        <TripSearchForm handleSearch={(e) => this.tripSearch(e)} />
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
