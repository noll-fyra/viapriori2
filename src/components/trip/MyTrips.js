import React from 'react'
import TripOverview from './TripOverview'
import db, {storageKey, storage} from '../../utils/firebase'

class MyTrips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: [],
      trips: [],
      images: []
    }
  }

  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey] + '/trips').on('value', (snapshot) => {
      this.setState({
        keys: Object.keys(snapshot.val())
      })
      for (var key in snapshot.val()) {
        db.ref('trips/' + key).once('value', (snapshot) => {
          this.setState({
            trips: this.state.trips.concat(snapshot.val())
          })
          if (snapshot.val().image) {
            storage.ref(snapshot.val().image).getDownloadURL().then((url) => {
              this.setState({
                images: this.state.images.concat(url)
              })
            })
          } else {
            this.setState({
              images: this.state.images.concat('')
            })
          }
        })
      }
    })
  }

  // displayTrip () {
  //   const keys = []
  //   const details = []
  //   for (var key in this.state.database) {
  //     if (this.state.database[key].user === window.localStorage[storageKey]) {
  //       keys.push(key)
  //       details.push(this.state.database[key])
  //     }
  //   }
  //   return details.map((trip, index) => {
  //     let path = '/trips/' + keys[index]
  //     return (
  //       <li key={keys[index]}>
  //         <p><Link to={path}>name: {trip.title}</Link></p>
  //         {trip.details &&
  //         <p>details: {trip.details}</p>}
  //         {trip.start &&
  //         <p>start: {new Date(trip.start).toLocaleDateString()}</p>}
  //         {trip.end &&
  //         <p>end: {new Date(trip.end).toLocaleDateString()}</p>}
  //       </li>
  //     )
  //   })
  // }

  render () {
    const allTrips = this.state.trips.map((trip, index) => {
      return <TripOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} image={this.state.images[index]} />
    })

    return (
      <div className='trips'>
        {allTrips}
      </div>
    )
  }
}

export default MyTrips
