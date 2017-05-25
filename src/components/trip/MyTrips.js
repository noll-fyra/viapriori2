import React from 'react'
import TripOverview from './TripOverview'
import db, {storageKey} from '../../utils/firebase'

class MyTrips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: [],
      trips: []
    }
  }

  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value').then((snapshot) => {
      let keys = Object.keys(snapshot.val())
      this.setState({
        keys: keys
      })
      let temp = keys.slice()
      for (var key in snapshot.val()) {
        let ind = keys.indexOf(key)
        db.ref('trips/' + key).once('value').then((snap) => {
          temp[ind] = snap.val()
          this.setState({
            trips: temp
          })
        })
      }
    })
  }

  render () {
    let reverse = this.state.trips.slice().reverse()
    return (
      <div className='trips'>
        <p>keys{JSON.stringify(this.state.keys)}</p>
        <p>keys{this.state.keys.length}</p>
        <p>trips{JSON.stringify(this.state.trips)}</p>
        <p>trips{this.state.trips.length}</p>
        {reverse.map((trip, index) => {
          return <TripOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} />
        })}
      </div>
    )
  }
}

export default MyTrips
