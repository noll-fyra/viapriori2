import React from 'react'
import db, {storageKey} from '../../utils/firebase'
import PlannedOverview from './PlannedOverview'

class Planned extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plannedKeys: props.plannedKeys,
      plannedTrips: [],
    }
  }



  componentDidMount () {
console.log('mount')
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

  removePlanned () {
    console.log('clicked')
    console.log(this)
    console.log(this.tripID)
    // let removeActivityID = e.target.name
    // db.ref('users/' + window.localStorage[storageKey] + '/saved/' + e.target.name).remove()
        //
    // console.log('users/' + window.localStorage[storageKey] + '/saved/' + e.target.name)

    db.ref('users/' + window.localStorage[storageKey] + '/planned/' + this.tripID).remove()
    db.ref('planned/' + this.tripID).remove()

    // this.displayActivity()
  }

  render () {
    console.log(this.props)
    console.log(this.props.plannedTrips)
    console.log(this.props.plannedKeys)
    console.log(this.state.plannedTrips)
    console.log(this.state.plannedKeys)
    return (
      <div>

        <h1> Planned Activities</h1>


          {this.props.plannedKeys &&
            this.props.plannedTrips.map((trip, index) => {
              return <PlannedOverview key={this.props.plannedKeys[index]} tripID={this.props.plannedKeys[index]} trip={trip} removePlanned={this.removePlanned}/>
            })
          }

        {/*
        {this.state.savedActivities &&
            reverseSaved.map((activity, index) => {
              return <PlannedOverview key={index} activityID={this.state.savedArray[index]} activity={activity} handlePlannedActivity={(e) => this.plannedActivity(e)} handleRemoveSaved={(e) => this.removeActivity(e)} />
            })} */}
      </div>
    )
  }
}

export default Planned
