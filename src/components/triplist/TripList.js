import React from 'react'

import search from '../../utils/search'
import SearchForm from '../search/SearchForm'
import TripItem from '../tripitem/TripItem'
import db, {auth} from '../../utils/firebase'

class TripList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      database: {},
      searchQuery: '',
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

        <h1> Featured Trips</h1>
          <TripItem database= {this.state.database} tripItems={this.state.tripDisplayed.filter((trip) => {
            // {console.log(this.state.searchQuery)}
            return trip.toLowerCase().includes(this.state.searchQuery.toLowerCase()) })} />

           {/* <TripItem tripItems={this.state.tripDisplayed} tripDetails={(e) => this.tripDetails(e)} />
         }
        {this.state.tripDetails} */}
      </div>
    )
  }
}

export default TripList
