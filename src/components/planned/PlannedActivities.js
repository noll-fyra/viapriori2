import React from 'react'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import SavedOverview from '../saved/SavedOverview'
import Planned from './Planned'
import db, {storageKey} from '../../utils/firebase'

const DragHandle = SortableHandle(() => <span>||||||</span>) // This can be any component you want

const SortableItem = SortableElement(({value, id}) => {
  return (
    <li>
      <DragHandle />
      <SavedOverview activityID={id} activity={value} />
    </li>
  )
})

const SortableList = SortableContainer(({activities, id}) => {
  return (
    <ul>
      {activities.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} id={id[index]} />
      ))}
    </ul>
  )
})

class PlannedActivities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      savedKeys: [],
      savedActivities: [],
      plannedTrips: [],
      plannedKeys: [],
      tripId: this.props.match.params.id
    }
  }

  componentDidMount () {
    db.ref('planned/' + this.props.match.params.id + '/activities').on('value', snapshot => {
      if (snapshot.val()) {
        // saved activity keys
        let savedKeys = Object.keys(snapshot.val())
        this.setState({
          savedKeys: savedKeys
        })
        // saved activity details
        let savedActivities = new Array(savedKeys.length).fill(null)
        for (var activity in snapshot.val()) {
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
    })
      // check if there are any planned trips
    db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
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
      } else {
        this.setState({
          plannedTrips: [],
          plannedKeys: []
        })
      }
    })
  }

  componentDidUpdate () {
    if (this.props.match.params.id !== this.state.tripId) {
      this.setState({
        tripId: this.props.match.params.id
      })
      db.ref('planned/' + this.props.match.params.id + '/activities').on('value', snapshot => {
        if (snapshot.val()) {
        // saved activity keys
          let savedKeys = Object.keys(snapshot.val())
          this.setState({
            savedKeys: savedKeys
          })
        // saved activity details
          let savedActivities = new Array(savedKeys.length).fill(null)
          for (var activity in snapshot.val()) {
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
      })
      // check if there are any planned trips
      db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
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
        } else {
          this.setState({
            plannedTrips: [],
            plannedKeys: []
          })
        }
      })
    }
  }

  onSortEnd ({oldIndex, newIndex}) {
    let activities = this.state.activities
    let keys = this.state.keys
    this.setState({
      activities: arrayMove(activities, oldIndex, newIndex),
      keys: arrayMove(keys, oldIndex, newIndex)
    })
    db.ref('trips/' + this.props.match.params.id + '/activities').once('value').then((snap) => {
      let newObj = snap.val() || {}
      this.state.keys.forEach((key, index) => {
        newObj[key] = index
      })
      db.ref('trips/' + this.props.match.params.id + '/activities').set(newObj)
    })
  }

  render () {
    // let reverseSaved = this.state.savedActivities.slice().reverse()
    // let reverseKeys = this.state.savedKeys.slice().reverse()
    let options = this.state.plannedTrips.map((trip, index) => {
      return <option key={this.state.plannedKeys[index]}>{trip.title}</option>
    })

    return (
      <div>
        <Planned plannedKeys={this.state.plannedKeys} plannedTrips={this.state.plannedTrips} />

        <h1> Saved Activities</h1>
        <SortableList
          activities={this.state.activities}
          onSortEnd={this.onSortEnd}
          useDragHandle
          id={this.state.keys}
          lockAxis='y'
        />

        {this.state.savedActivities &&
          this.state.savedActivities.map((activity, index) => {
            return <SavedOverview
              key={this.state.savedKeys[index]}
              activityID={this.state.savedKeys[index]}
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

export default PlannedActivities
