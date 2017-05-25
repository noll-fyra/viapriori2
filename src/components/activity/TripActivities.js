import React from 'react'
// import NewTrip from './NewTrip'
// import MyTrips from './MyTrips'
// import MyProfile from '../user/Profile'
import db, {storage, storageKey} from '../../utils/firebase'


class TripActivities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        isNewTrip: false,
        newTripName: '',
        trips: [],
        tripIDs: [],
        tripIndex: 0,
        title: '',
        imagePath: '',
        imageName: '',
        imageLatLng: '',
        date: '',
        description: '',
        image: '',
        locality: '',
        country: '',
        rating: 0
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
    this.setState({
        //  activityIDs: this.state.tripIDs.concat(trip)
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
        {/* <MyProfile /> */}
        {/* <button onClick={this.openAddTrip}>New Trip</button> */}
        {/* <NewTrip isOpen={this.state.addTripIsOpen} onOpen={this.openAddTrip} onClose={this.closeAddTrip} /> */}
        {/* <MyTrips /> */}
      </div>
    )
  }
}

export default TripActivities
