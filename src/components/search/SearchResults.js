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
    db.ref('trips').on('value', (snapshot) => {
      const keys = []
      const allTrips = []
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
        tripDisplayed: allTrips
      })
      // console.log(this.state.database)
      // console.log(this.state.tripDisplayed)
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
        <SearchForm onChange={(e) => this.search(e)} />

        <h1>Search Results</h1>
          <TripItem tripItems={this.state.tripDisplayed.filter((trip) => {

            // {console.log(this.state.searchQuery)}
            if (this.state.searchQuery) {
            return trip.toLowerCase().includes(this.state.searchQuery.toLowerCase())
          } else {
            return null
          }
        })
      } />
      </div>
    )
  }
}

export default SearchResults
