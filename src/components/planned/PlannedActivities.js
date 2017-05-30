import React from 'react'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import ActivityOverview from '../activity/ActivityOverview'
import Planned from './Planned'
import db, {storageKey} from '../../utils/firebase'

const DragHandle = SortableHandle(() => <span>||||||</span>) // This can be any component you want

const SortableItem = SortableElement(({value, id, options, plannedKeys, plannedTrips, createNewPlanned}) => {
  return (
    <li>
      {/* <ActivityOverview activityID={id} activity={value} clickToSearch={clickToSearch} />
      {value.user !== window.localStorage[storageKey] &&
      } */}
      <DragHandle />
      <ActivityOverview activityID={id} activity={value} />
      {/* <SaveActivity activityID={id} activity={value} url={url}/> */}
    </li>
  )
})

const SortableList = SortableContainer(({activities, id, options, plannedKeys, plannedTrips, createNewPlanned}) => {
  return (
    <ul>
      {activities.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} id={id[index]} options={options} plannedKeys={plannedKeys} plannedTrips={plannedTrips} createNewPlanned={createNewPlanned} />
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

    // this.onSortEnd = this.onSortEnd.bind(this)
    this.componentUpdates = this.componentUpdates.bind(this)
  }

  componentDidMount () {
    this.componentUpdates()
  }

  componentDidUpdate () {
    if (this.props.match.params.id !== this.state.tripId) {
      this.setState({
        tripId:this.props.match.params.id
      })
      this.componentUpdates()
    }
  }

  componentUpdates () {
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

  render () {

    let options = this.state.plannedTrips.map((trip, index) => {
      return <option key={this.state.plannedKeys[index]}>{trip.title}</option>
    })

    return (
      <div>
        <Planned plannedKeys={this.state.plannedKeys} plannedTrips={this.state.plannedTrips} />

        <h1> Saved Activities</h1>
        <SortableList
          activities={this.state.savedActivities}
          onSortEnd={this.onSortEnd}
          useDragHandle
          lockAxis='y'
          id={this.state.savedKeys}
          options={options}
          plannedKeys={this.state.plannedKeys}
          plannedTrips={this.state.plannedTrips}
          createNewPlanned={this.createNewPlanned}
        />

        {/* {this.state.savedActivities &&
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
        } */}
      </div>
    )
  }
}

export default PlannedActivities
