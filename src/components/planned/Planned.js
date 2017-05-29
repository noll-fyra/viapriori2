import React from 'react'
import db, {storageKey} from '../../utils/firebase'
import PlannedOverview from './PlannedOverview'

class Planned extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plannedKeys: props.plannedKeys,
      plannedTrips: props.plannedTrips
    }
    this.removePlanned = this.removePlanned.bind(this)
  }

  componentWillReceiveProps () {
    // console.log(this.props.plannedKeys)
    this.setState({
      plannedKeys: this.props.plannedKeys,
      plannedTrips: this.props.plannedTrips
    })

    // db.ref('users/' + window.localStorage[storageKey] + '/planned').once('value').then((snapshot) => {
      // this.displayTrips()
    // })
  }
      //
      // plannedActivity(e){
      //   let savedActivityID = e.target.name
      //   db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snap) => {
      //     let newObj = snap.val() || {}
      //     newObj[savedActivityID] = true
      //     db.ref('users/' + window.localStorage[storageKey] + '/saved').set(newObj)
      //   })
      // }
  // displayTrips () {
  //   db.ref('users/' + window.localStorage[storageKey] + '/planned').once('value').then((snapshot) => {
  //     if (snapshot.val()) {
  //       let plannedArray = Object.keys(snapshot.val())
  //       this.setState({
  //         plannedArray: plannedArray
  //       })
  //       let temp = plannedArray.slice()
  //       for (var trip in snapshot.val()) {
  //         let ind = plannedArray.indexOf(trip)
  //         db.ref('trips/' + trip).once('value').then((snap) => {
  //           temp[ind] = snap.val()
  //           this.setState({
  //             plannedTrips: temp
  //           })
  //         })
  //       }
  //       this.displayActivities()
  //     } else {
  //       this.setState({
  //         plannedTrips: []
  //       })
  //     }
  //   })
  // }
  //
  // displayActivities () {
  //   let arrTrips = this.state.plannedTrips.slice()
  //   console.log(arrTrips)
  //   arrTrips.forEach((activity) => {
  //     let index = arrTrips.indexOf(activity)
  //     db.ref('activities/' + activity).once('value').then((snap) => {
  //       this.state.plannedTrips[index] = snap.val()
  //           this.setState({
  //             savedActivities: temp
  //           })
  //     })
  //   })

    //   } else {
    //     this.setState({
    //       savedActivities: []
    //     })
    //   }
    // })
  // }

  removePlanned (tripID) {
    db.ref('users/' + window.localStorage[storageKey] + '/planned/' + tripID).remove()
    db.ref('planned/' + tripID).remove()
    this.setState({
      plannedKeys: this.props.plannedKeys,
      plannedTrips: this.props.plannedTrips
    })
  }

  render () {
    const planned = this.props.plannedTrips.map((trip, index) => {
      return <PlannedOverview key={this.props.plannedKeys[index]} tripID={this.props.plannedKeys[index]} trip={trip} removePlanned={this.removePlanned} />
    })
    return (
      <div>
        <h1> Planned Activities</h1>
        {planned}
      </div>
    )
  }
}

export default Planned
