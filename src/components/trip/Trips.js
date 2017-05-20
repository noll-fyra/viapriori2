import React from 'react'
import AddTrip from './AddTrip'
import MyTrips from './MyTrips'
// import TestTrip from './TestTrip'
// import {BrowserRouter as Router, Route} from 'react-router-dom'

class Trips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      form: []
    }
  }
  render () {
    return (
      <div>
        <MyTrips />
        <AddTrip />
        hello
      </div>
    )
  }

}

export default Trips
