import React from 'react'
import AddTrip from './AddTrip'
import MyTrips from './MyTrips'
// import TestTrip from './TestTrip'
// import {BrowserRouter as Router, Route} from 'react-router-dom'

class Trips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      addTripIsOpen: false
    }
    this.openAddTrip = this.openAddTrip.bind(this)
    this.closeAddTrip = this.closeAddTrip.bind(this)
  }

  openAddTrip () {
    this.setState({
      addTripIsOpen: true
    })
  }

  closeAddTrip () {
    this.setState({
      addTripIsOpen: false
    })
  }

  render () {
    return (
      <div>
        <button onClick={this.openAddTrip}>New Trip</button>
        <AddTrip isOpen={this.state.addTripIsOpen} onOpen={this.openAddTrip} onClose={this.closeAddTrip} />
        <MyTrips />
      </div>
    )
  }

}

export default Trips
