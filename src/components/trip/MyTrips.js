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
    db.ref('trips/' + auth.currentUser.uid).on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
    })
  }

  displayTrip () {
    const keys = []
    const details = []
    for (var key in this.state.database) {
      keys.push(key)
      details.push(this.state.database[key])
    }
    return details.map((trip, index) => {
      let path = '/trips/' + keys[index]
      return (
        <li key={keys[index]}>
          <p><Link to={path}>name: {trip.title}</Link></p>
          <p>details: {trip.details}</p>
          <p>start: {new Date(trip.start).toLocaleDateString()}</p>
          <p>end: {new Date(trip.end).toLocaleDateString()}</p>
        </li>
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