import React from 'react'
import db, {storage, storageKey} from '../../utils/firebase'
import SavedOverview from './SavedOverview'
import Planned from '../planned/Planned'

class Saved extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      savedArray: [],
      savedActivities: [],
      plannedTrips: [],
      plannedArray:[],
      isNewPlanned: false,
      plannedTripID: '',
    }
    this.addSavedActivityToPlanned = this.addSavedActivityToPlanned.bind(this)
    this.createNewPlanned = this.createNewPlanned.bind(this)
    this.displayActivity = this.displayActivity.bind(this)
    this.removeActivity = this.removeActivity.bind(this)
    this.startNewPlanned = this.startNewPlanned.bind(this)
    this.currentPlannedTrips = this.currentPlannedTrips.bind(this)
  }
  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snapshot) => {
      this.displayActivity()
      this.currentPlannedTrips()
      console.log(this.state.isNewPlanned)

    })
  }
  displayActivity () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snapshot) => {
      if (snapshot.val()) {
        let savedArray = Object.keys(snapshot.val())
        this.setState({
          savedArray: savedArray
        })
        let temp = savedArray.slice()
        for (var activity in snapshot.val()) {
          let ind = savedArray.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            temp[ind] = snap.val()
            this.setState({
              savedActivities: temp
            })
          })
        }
      } else {
        this.setState({
          savedActivities: []
        })
      }
    })
  }
  removeActivity (e) {
    let removeActivityID = e.target.name
    db.ref('users/' + window.localStorage[storageKey] + '/saved/' + e.target.name).remove()
        //
    this.displayActivity()
  }

// ////////// planned trip methods from here down

  // plannedActivity(e){
  //   let savedActivityID = e.target.name
  //   db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snap) => {
  //     let newObj = snap.val() || {}
  //     newObj[savedActivityID] = true
  //     db.ref('users/' + window.localStorage[storageKey] + '/saved').set(newObj)
  //   })
  // }

  startNewPlanned (boolean) {
    this.setState({
      isNewPlanned: boolean
    })
  }

  currentPlannedTrips () {
    db.ref('users/' + window.localStorage[storageKey] + '/planned').once('value').then((snapshot) => {
      if (snapshot.val()) {
        let plannedArray = Object.keys(snapshot.val())
        console.log(plannedArray, 'planned array')
        this.setState({
          plannedArray: plannedArray
        })
        if (plannedArray.length === 0) {
          this.setState({
            isNewPlanned: true
          })
        }
        let tempPlanned = plannedArray.slice()
        for (var trip in snapshot.val()) {
          let index = plannedArray.indexOf(trip)
          db.ref('planned/' + trip).once('value').then((snap) => {
            tempPlanned[index] = snap.val()
            this.setState({
              plannedTrips: tempPlanned
            })
          })
        }
      } else {
        console.log("else statement")
        this.setState({
          plannedTrips: [],
          plannedArray: [],
          isNewPlanned: true
        })
      }
    })
    // console.log(this.state)

  }

  chooseTrip (e) {
    this.setState({
      tripIndex: e.target.selectedIndex
    })
  }

  createNewPlanned (e) {
    e.preventDefault()
    let newPlannedTripID = ''
    if (this.state.isNewPlanned) {
      const form = e.target
      const input = form.querySelector('#newPlanned')
        // console.log(input.value)
      this.setState({
        newPlannedTripName: input.value
      })
      let plannedtrips = db.ref('planned')
      let newRef = plannedtrips.push()
      let newPlannedTripID = newRef.key
      newRef.set({
        user: window.localStorage[storageKey],
        title: input.value
      })
      db.ref('users/' + window.localStorage[storageKey] + '/planned').once('value', snap => {
        let newObj = snap.val() || {}
        newObj[newPlannedTripID] = true
        db.ref('users/' + window.localStorage[storageKey] + '/planned').set(newObj)
      })
    }
    console.log(this.state.isNewPlanned)
    // console.log(e.target.name)
    console.log(newPlannedTripID)
    console.log(this.state.plannedArray)
  let plannedTripID = this.state.isNewPlanned ? newPlannedTripID : this.state.plannedArray.reverse()[this.state.tripIndex]
  console.log(plannedTripID)
    this.setState({
      plannedTripID: plannedTripID,
      plannedActivityID: e.target.name
    })
    this.addSavedActivityToPlanned()
  }

  addSavedActivityToPlanned(){
    // console.log('save activity')
    console.log(this.state.plannedTripID)
    // console.log(this.state.plannedActivityID)
    db.ref('planned/' + this.state.plannedTripID ).once('value').then((snap) => {
      console.log(snap.val())
      // let newObject = snap.val() || {}
      // let currentActivities = snap.val().activities || {}
      // currentActivities[this.state.plannedActivityID] = true
      // newObject['activities'] = currentActivities
      // db.ref('planned/'+ this.state.plannedTripID + "/activities").set(newObject)

      // let newObj = snap.val() || {}
      // let currentActivities = snap.val().activities || {}
      // currentActivities[newActivityID] = true
      // newObj['activities'] = currentActivities
      // let currentRating = snap.val().totalRating || 0
      // newObj['totalRating'] = currentRating + this.state.rating
      // db.ref('trips/' + tripID).set(newObj)
    })


  }

  render () {
    let reverseSaved = this.state.savedActivities.slice().reverse()
    let plannedArray = this.state.plannedArray.slice().reverse()
    let options = plannedArray.map((title, index) => {
      return <option key={index}>{title}</option>
    })
    // console.log(this.state.plannedArray, 'plannedarray for user')
    //
    // console.log(this.state.plannedTrips, 'plannedtrips for user')
    return (
      <div>
        {/* <Planned/> */}
        <h1> Saved Activities</h1>

        {this.state.savedActivities &&
            reverseSaved.map((activity, index) => {
              return <SavedOverview key={index}
                activityID={this.state.savedArray[index]}
                activity={activity}
              // handlePlannedActivity={(e) => this.plannedActivity(e)}
                handleRemoveSaved={(e) => this.removeActivity(e)}
                isPlanned={this.state.isNewPlanned}
                options={options}
                chooseTrip={(e) => this.chooseTrip(e)}
                trips={plannedArray}
                startNewPlanned={(e) => this.startNewPlanned(true)}
                switchNewPlanned={(e) => this.startNewPlanned(false)}
                createNewPlanned={(e) => this.createNewPlanned(e)} />
            })}
      </div>
    )
  }
}

export default Saved
