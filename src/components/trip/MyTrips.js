import React from 'react'
import {Link} from 'react-router-dom'
import db, {auth} from '../../utils/firebase'

class MyTrips extends React.Component {
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

  displayTrip () {
    const keys = []
    const details = []
    for (var key in this.state.database) {
      if (this.state.database[key].user === auth.currentUser.uid) {
        keys.push(key)
        details.push(this.state.database[key])
      }
    }
    return details.map((trip, index) => {
      let path = '/trips/' + keys[index]
      return (
        <div>
        <li key={keys[index]}>
          <p><Link to={path}>name: {trip.title}</Link></p>
          {trip.details &&
          <p>details: {trip.details}</p>}
          {trip.start &&
          <p>start: {new Date(trip.start).toLocaleDateString()}</p>}
          {trip.end &&
          <p>end: {new Date(trip.end).toLocaleDateString()}</p>}
        </li>
      </div>
      )
    })
  }

  render () {
    return (
      <div>
        <ul>
          {this.displayTrip()}
        </ul>
      </div>
    )
  }
}

export default MyTrips
