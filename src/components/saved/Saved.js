import React from 'react'
// import TripSearchForm from '../tripsearchform/TripSearchForm'
// import TripItem from '../tripitem/TripItem'
const favorites = [
  'Favorites1',
  'Favorites2',
  'Favorites3'
]

class Saved extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      favoritesDisplayed: ['america', 'russia', 'iceland']
    }
  }

  render () {
    return (
      <div>
        {/* <TripSearchForm handleSearch= {
          (e) => this.tripSearch(e)
        }/> */}
        <h1> FavoritesList Trip</h1>
        <p>{favorites}</p>
        {/* <TripItem tripItems= {this.state.tripDisplayed}/> */}
      </div>
    )
  }
}

export default Saved
