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
      let temp = []
      let images = []
      for (var key in snapshot.val()) {
        db.ref('trips/' + key).once('value', (snap) => {
          // this.setState({
          //   trips: this.state.trips.concat(snap.val())
          // })
          temp.push(snap.val())
          this.setState({
            trips: temp
          })
          if (snap.val().image) {
            storage.ref(snap.val().image).getDownloadURL().then((url) => {
              images.push(url)
              this.setState({
                images: images
              })
            })
          } else {
            images.push('')
            this.setState({
              images: images
            })
            // this.setState({
            //   images: this.state.images.concat('')
            // })
          }
          // this.setState({
          //   trips: temp,
          //   images: images
          // })
        })
        // this.setState({
        //   trips: temp
        // })
      }


    })
  }

  render () {
    // const allTrips = this.state.trips.map((trip, index) => {
    //   return <TripOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} image={this.state.images[index]} />
    // })

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
