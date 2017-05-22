import React from 'react'
import SearchForm from './SearchForm'
import TripItem from '../tripitem/TripItem'
import db from '../../utils/firebase'
import search from '../../utils/search'

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.searchQuery,
      database: {},
      tripDisplayed: []
    }
    this.search = search.bind(this)
  }

  componentDidMount () {
    // console.log('mount')
    db.ref('trips').on('value', (snapshot) => {
      const keys = []
      const allTrips = []
      // console.log(this.state.database, 'hi')
      for (var key in snapshot.val()) {
        keys.push(key)
        let tripEnd = new Date(snapshot.val()[key].end)
        let tripStart = new Date( snapshot.val()[key].start)
        let tripDuration = (tripEnd - tripStart)/86400000
        let text = tripDuration + ' days: '+ snapshot.val()[key].title
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
    return (
      <div>

        <h1>Search Results</h1>
          <TripItem tripId={this.state.tripId}  tripItems={this.state.tripDisplayed.filter((trip) => {
            // if (this.state.searchQuery) {
            return trip.toLowerCase().includes(this.state.searchQuery.toLowerCase())
          // } else {
          //   return null
          // }
        })
      } />
      </div>
    )
  }
}

export default SearchResults
