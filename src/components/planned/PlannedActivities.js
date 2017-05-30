import React from 'react'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import SavedOverview from '../saved/SavedOverview'
import Planned from './Planned'
import db, {storageKey} from '../../utils/firebase'

const DragHandle = SortableHandle(() => <span>||||||</span>) // This can be any component you want

const SortableItem = SortableElement(({value, id, options, plannedKeys, plannedTrips, createNewPlanned}) => {
  return (
    <li>
      <DragHandle />
      <SavedOverview activityID={id} activity={value} options={options} plannedKeys={plannedKeys} plannedTrips={plannedTrips} createNewPlanned={createNewPlanned} />
      {5}
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
    this.onSortEnd = this.onSortEnd.bind(this)
    this.createNewPlanned = this.createNewPlanned.bind(this)
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

  // componentDidUpdate () {
  //   if (this.props.match.params.id !== this.state.tripId) {
  //     this.setState({
  //       tripId: this.props.match.params.id
  //     })
  //     db.ref('planned/' + this.props.match.params.id + '/activities').on('value', snapshot => {
  //       if (snapshot.val()) {
  //       // saved activity keys
  //         let savedKeys = Object.keys(snapshot.val())
  //         this.setState({
  //           savedKeys: savedKeys
  //         })
  //       // saved activity details
  //         let savedActivities = new Array(savedKeys.length).fill(null)
  //         for (var activity in snapshot.val()) {
  //           let ind = savedKeys.indexOf(activity)
  //           db.ref('activities/' + activity).once('value').then((snap) => {
  //             savedActivities[ind] = snap.val()
  //             this.setState({
  //               savedActivities: savedActivities
  //             })
  //           })
  //         }
  //       } else {
  //         this.setState({
  //           savedKeys: [],
  //           savedActivities: []
  //         })
  //       }
  //     })
  //     // check if there are any planned trips
  //     db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
  //       if (snapshot.val() && snapshot.val().planned) {
  //       // planned trip keys
  //         let plannedKeys = Object.keys(snapshot.val().planned)
  //         this.setState({
  //           plannedKeys: plannedKeys
  //         })
  //       // planned trip details
  //         let plannedTrips = new Array(plannedKeys.length).fill(null)
  //         for (var trip in snapshot.val().planned) {
  //           let ind = plannedKeys.indexOf(trip)
  //           db.ref('planned/' + trip).on('value', snap => {
  //             plannedTrips[ind] = snap.val()
  //             this.setState({
  //               plannedTrips: plannedTrips
  //             })
  //           })
  //         }
  //       } else {
  //         this.setState({
  //           plannedTrips: [],
  //           plannedKeys: []
  //         })
  //       }
  //     })
  //   }
  // }

  onSortEnd ({oldIndex, newIndex}) {
    let savedActivities = this.state.savedActivities
    let savedKeys = this.state.savedKeys
    this.setState({
      savedActivities: arrayMove(savedActivities, oldIndex, newIndex),
      savedKeys: arrayMove(savedKeys, oldIndex, newIndex)
    })
    // db.ref('trips/' + this.props.match.params.id + '/activities').once('value').then((snap) => {
    //   let newObj = snap.val() || {}
    //   this.state.keys.forEach((key, index) => {
    //     newObj[key] = index
    //   })
    //   db.ref('trips/' + this.props.match.params.id + '/activities').set(newObj)
    // })
  }

  createNewPlanned(){

  }

  render () {
    let options = this.state.plannedTrips.map((trip, index) => {
      return <option key={this.state.plannedKeys[index]}>{trip.title}</option>
    })

    return (
      <div>
        {/* <Planned plannedKeys={this.state.plannedKeys} plannedTrips={this.state.plannedTrips} /> */}

        <h1> Saved Activities</h1>
        <SortableList
          activities={this.state.savedActivities}
          onSortEnd={this.onSortEnd}
          useDragHandle={true}
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
