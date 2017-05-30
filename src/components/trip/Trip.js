import React from 'react'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import ActivityOverview from '../activity/ActivityOverview'
import SaveActivity from '../activity/SaveActivity'
import db, {storageKey} from '../../utils/firebase'
const DragHandle = SortableHandle(() => <span>||||||</span>) // This can be any component you want

const SortableItem = SortableElement(({value, id, clickToSearch, url}) => {
  return (
    <li>
      <DragHandle />
      <ActivityOverview activityID={id} activity={value} clickToSearch={clickToSearch} />
      {value.user !== window.localStorage[storageKey] &&
      <SaveActivity activityID={id} activity={value} url={url} />
      }
    </li>
  )
})

const SortableList = SortableContainer(({activities, id, clickToSearch, url}) => {
  return (
    <ul>
      {activities.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} id={id[index]} clickToSearch={clickToSearch} url={url} />
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
    this.setState({
      currentUser: this.props.currentTrip || this.props.match.params.id
    })
    db.ref('trips/' + this.state.currentTrip).on('value', snapshot => {
      if (snapshot.val()) {
        let tripDetails = snapshot.val() || {}
        let tempKeys = []
        for (var key in tripDetails.activities) {
          tempKeys.push([key, tripDetails.activities[key]])
        }
        let keys = tempKeys.sort((a, b) => { return a[1] - b[1] }).map((key) => { return key[0] })
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
        <p>activities{JSON.stringify(this.state.activities)}</p>
        <p>keys{JSON.stringify(this.state.keys)}</p>
        <SortableList
          url={this.props.match.params.id}
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
