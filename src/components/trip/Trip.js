import React from 'react'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import ActivityOverview from '../activity/ActivityOverview'
import db from '../../utils/firebase'

const DragHandle = SortableHandle(() => <span>||||||</span>) // This can be any component you want

const SortableItem = SortableElement(({value, id, clickToSearch}) => {
  return (
    <li>
      <DragHandle />
      <ActivityOverview activityID={id} activity={value} clickToSearch={clickToSearch} />
    </li>
  )
})

const SortableList = SortableContainer(({activities, id, clickToSearch}) => {
  return (
    <ul>
      {activities.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} id={id[index]} clickToSearch={clickToSearch} />
      ))}
    </ul>
  )
})

class Trip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activities: [],
      keys: [],
      details: {},
      currentTrip: props.currentTrip || props.match.params.id
    }
    this.onSortEnd = this.onSortEnd.bind(this)
    this.updateTrip = this.updateTrip.bind(this)
  }

  componentDidMount () {
    this.updateTrip()
  }

  componentWillReceiveProps (nextProps) {
    this.updateTrip()
  }

  updateTrip () {
    db.ref('trips/' + this.state.currentTrip).orderByChild('index').on('value', snapshot => {
      if (snapshot.val()) {
        let tripDetails = snapshot.val() || {}
        let keys = Object.keys(tripDetails.activities)
        this.setState({
          keys: keys,
          details: tripDetails
        })

        let temp = keys.slice()
        for (var activity in snapshot.val().activities) {
          let ind = keys.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            temp[ind] = snap.val()
            this.setState({
              activities: temp
            })
          })
        }
      }
    })
  }

  onSortEnd ({oldIndex, newIndex}) {
    let activities = this.state.activities
    let keys = this.state.keys
    this.setState({
      activities: arrayMove(activities, oldIndex, newIndex),
      keys: arrayMove(keys, oldIndex, newIndex)
    })
    db.ref('trips/' + this.state.currentTrip + '/activities').once('value').then((snap) => {
      let newObj = snap.val() || {}
      this.state.keys.forEach((key, index) => {
        newObj[key] = index
      })
      db.ref('trips/' + this.state.currentTrip + '/activities').set(newObj)
    })
  }

  render () {
    return (
      <div>
        <h1>{this.state.details.title || ''}</h1>
        <SortableList
          activities={this.state.activities}
          onSortEnd={this.onSortEnd}
          useDragHandle
          lockAxis='y'
          id={this.state.keys}
          clickToSearch={this.props.clickToSearch}
        />
      </div>
    )
  }
}

export default Trip
