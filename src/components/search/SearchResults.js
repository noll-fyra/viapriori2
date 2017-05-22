import React from 'react'
import TripOverview from '../trip/TripOverview'
import db from '../../utils/firebase'

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.searchQuery,
      database: {},
      tripdId: [],
      tripDisplayed: []
    }
  }

  componentDidMount () {
    db.ref('trips').on('value', (snapshot) => {
      const keys = []
      const allTrips = []
      for (var key in snapshot.val()) {
        keys.push(key)
        let tripEnd = new Date(snapshot.val()[key].end)
        let tripStart = new Date(snapshot.val()[key].start)
        let tripDuration = (tripEnd - tripStart) / 86400000
        let text = tripDuration + ' days: ' + snapshot.val()[key].title
        allTrips.push(text.toString())
      }
      this.setState({
        database: snapshot.val(),
        tripId: keys,
        tripDisplayed: allTrips
      })
      console.log(this.state.tripDisplayed)
    })
  }

  render () {
    const trips = this.state.tripDisplayed.filter((trip) => {
      return trip.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    })
    return (
      <div>
        <h1>Search Results</h1>
        <TripOverview tripId={this.state.tripId} tripItems={trips} />
      </div>
    )
  }
}

export default SearchResults
