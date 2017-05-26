import React from 'react'
// import NewTrip from './NewTrip'
// import MyTrips from './MyTrips'
// import MyProfile from '../user/Profile'
import db, {storage, storageKey} from '../../utils/firebase'


class TripActivities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        trips: [],
        tripIDs: [],
        title: [],
        imagePath: [],
        imageName: [],
        imageLatLng: [],
        date: [],
        description: [],
        image: [],
        locality: [],
        country: [],
        rating: []
    }

  }

  componentDidMount () {
    // console.log(this.props.match.params.id)
    db.ref('trips/'+this.props.match.params.id+'/activities').once('value').then((snap) => {
      // console.log(snap.val())
      // console.log(Object.keys(snap.val()))
        let activityArray = Object.keys(snap.val())

activityArray.forEach((activity)=>{

  db.ref('activities/'+activity).once('value').then((snapshot) => {
    console.log(snapshot.val())
    // this.setState({
        //  activityIDs: this.state.tripIDs.concat(trip)
      //  })


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

})
        //   activityArray.forEach
        //  Object.keys(snap.val()).forEach((trip) => {
        //     this.setState({
        //       tripIDs: this.state.tripIDs.concat(trip)
        //     })
        //     db.ref('trips/' + trip).once('value', (snap) => {
        //       this.setState({
        //         trips: this.state.trips.concat(snap.val().title)
        //       })
    //   Object.keys(snap.val()).forEach((trip) => {
    //     this.setState({
    //       tripIDs: this.state.tripIDs.concat(trip)
    //     })
    //     db.ref('trips/' + trip).once('value', (snap) => {
    //       this.setState({
    //         trips: this.state.trips.concat(snap.val().title)
    //       })
    //     })
    //   })
    //
    })
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
        <h1>Trip Activities - To Be routed/component elsewhere</h1>
        {this.state.trips.map((trip, index) => {
          return <ActivityOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} image={this.state.images[index]} />
        })}

        {/* <MyProfile /> */}
        {/* <button onClick={this.openAddTrip}>New Trip</button> */}
        {/* <NewTrip isOpen={this.state.addTripIsOpen} onOpen={this.openAddTrip} onClose={this.closeAddTrip} /> */}
        {/* <MyTrips /> */}
      </div>
    )
  }
}

export default TripActivities
