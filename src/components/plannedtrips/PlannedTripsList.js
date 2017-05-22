import React from 'react'
// import TripSearchForm from '../tripsearchform/TripSearchForm'
// import TripItem from '../tripitem/TripItem'
const planned = [
  'Planned1',
  'Planned2',
  'Planned3'
]

class PlannedTripsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plannedDisplayed: planned
    }
  }

  render () {
    return (
      <div>

        {/* <TripSearchForm handleSearch= {
          (e) => this.tripSearch(e)
        }/> */}
        <h1> Planned Trip</h1>
        <p>{this.state.plannedDisplayed}</p>
        {/* <TripItem tripItems= {this.state.tripDisplayed}/> */}
      </div>
    )
  }
}

export default PlannedTripsList
