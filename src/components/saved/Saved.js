import React from 'react'
import db, {storageKey} from '../../utils/firebase'
import SavedOverview from './SavedOverview'
import Planned from '../planned/Planned'

class Saved extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      savedKeys: [],
      savedActivities: [],
      plannedTrips: [],
      plannedKeys: []
    }
    this.createNewPlanned = this.createNewPlanned.bind(this)
  }

  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
      if (snapshot.val() && snapshot.val().saved) {
        // saved activity keys
        let savedKeys = Object.keys(snapshot.val().saved)
        this.setState({
          savedKeys: savedKeys
        })
        // saved activity details
        let savedActivities = new Array(savedKeys.length).fill(null)
        for (var activity in snapshot.val().saved) {
          let ind = savedKeys.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            savedActivities[ind] = snap.val()
            this.setState({
              savedActivities: savedActivities
            })
          })
        }
      } else {
        this.setState({
          savedKeys: [],
          savedActivities: []
        })
      }

      // check if there are any planned trips
      if (snapshot.val() && !snapshot.val().planned) {
        this.setState({
          plannedTrips: [],
          plannedKeys: []
        })
      }

      if (snapshot.val() && snapshot.val().planned) {
        // planned trip keys
        let plannedKeys = Object.keys(snapshot.val().planned)
        this.setState({
          plannedKeys: plannedKeys
        })
        // planned trip details
        let plannedTrips = new Array(plannedKeys.length).fill(null)
        for (var trip in snapshot.val().planned) {
          let ind = plannedKeys.indexOf(trip)
          db.ref('planned/' + trip).on('value', snap => {
            plannedTrips[ind] = snap.val()
            this.setState({
              plannedTrips: plannedTrips
            })
          })
        }
      }
    })
  }

  createNewPlanned (title) {
    let newRef = db.ref('planned').push()
    let newPlannedTripID = newRef.key
    newRef.set({
      user: window.localStorage[storageKey],
      title: title
    })
    db.ref('users/' + window.localStorage[storageKey] + '/planned').once('value', snap => {
      let newObj = snap.val() || {}
      newObj[newPlannedTripID] = true
      db.ref('users/' + window.localStorage[storageKey] + '/planned').set(newObj)
    })
    return newRef.key
  }

  render () {
    let reverseSaved = this.state.savedActivities.slice().reverse()
    let reverseKeys = this.state.savedKeys.slice().reverse()
    let options = this.state.plannedTrips.map((trip, index) => {
      return <option key={this.state.plannedKeys[index]}>{trip.title}</option>
    })
    console.log(this.state.plannedTrips)
    // console.log(this.state.plannedKeys)
    return (
      <div>
        <Planned plannedKeys = {this.state.plannedKeys}
        plannedTrips = {this.state.plannedTrips}/>

        <p>{JSON.stringify(this.state.savedKeys)}</p>
        <p>{JSON.stringify(this.state.savedActivities)}</p>
        <p>{JSON.stringify(this.state.plannedKeys)}</p>
        <p>{JSON.stringify(this.state.plannedTrips)}</p>
        <h1> Saved Activities</h1>

        {this.state.savedActivities &&
          reverseSaved.map((activity, index) => {
            return <SavedOverview
              key={reverseKeys[index]}
              activityID={reverseKeys[index]}
              activity={activity}
              options={options}
              plannedKeys={this.state.plannedKeys}
              plannedTrips={this.state.plannedTrips}
              createNewPlanned={this.createNewPlanned}
            />
          })
        }
      </div>
    )
  }
}

export default Saved
