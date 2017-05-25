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
    db.ref('users/' + window.localStorage[storageKey] + '/trips').once('value').then((snapshot) => {
      let keys = Object.keys(snapshot.val())
      this.setState({
        keys: keys
      })
      let temp = keys.slice()
      let images = keys.slice()
      for (var key in snapshot.val()) {
        let ind = keys.indexOf(key)
        db.ref('trips/' + key).once('value').then((snap) => {
          temp[ind] = snap.val()
          this.setState({
            trips: temp
          })
          if (snap.val().image) {
            storage.ref(snap.val().image).getDownloadURL().then((url) => {
              images[ind] = url
              this.setState({
                images: images
              })
            })
          } else {
            images[ind] = ''
            this.setState({
              images: images
            })
          }
        })
      }
      this.setState({
        trips: temp,
        images: images
      })
    })
  }

  render () {
    return (
      <div className='trips'>
        <p>keys{JSON.stringify(this.state.keys)}</p>
        <p>trips{JSON.stringify(this.state.trips)}</p>
        <p>images{JSON.stringify(this.state.images)}</p>
        {this.state.trips.map((trip, index) => {
          return <TripOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} image={this.state.images[index]} />
        })}
      </div>
    )
  }
}

export default MyTrips
