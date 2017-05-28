import React from 'react'
import moment from 'moment'
import Rating from '../rating/Rating'
import db, {storageKey} from '../../utils/firebase'

class SavedOverview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newPlannedTitle: '',
      isNewPlanned: false,
      plannedIndex: 0
    }
    this.switchNewPlanned = this.switchNewPlanned.bind(this)
    this.handlePlannedTitle = this.handlePlannedTitle.bind(this)
    this.addActivityToNewPlanned = this.addActivityToNewPlanned.bind(this)
    this.addActivityToExisting = this.addActivityToExisting.bind(this)
    this.removeActivity = this.removeActivity.bind(this)
    this.chooseTrip = this.chooseTrip.bind(this)
  }

  switchNewPlanned () {
    this.setState({
      isNewPlanned: !this.state.isNewPlanned
    })
  }

  handlePlannedTitle (e) {
    this.setState({
      newPlannedTitle: e.target.value
    })
  }

  addActivityToNewPlanned () {
    let newPlannedID = this.props.createNewPlanned(this.state.newPlannedTitle)
    this.setState({
      newPlannedTitle: ''
    })
    db.ref('planned/' + newPlannedID + '/activities').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[this.props.activityID] = true
      db.ref('planned/' + newPlannedID + '/activities').set(newObj)
    })
  }

  addActivityToExisting () {
    this.setState({
      newPlannedTitle: ''
    })
    db.ref('planned/' + this.props.plannedKeys[this.state.plannedIndex] + '/activities').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[this.props.activityID] = true
      db.ref('planned/' + this.props.plannedKeys[this.state.plannedIndex] + '/activities').set(newObj)
    })
  }

  removeActivity () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved/' + this.props.activityID).remove()
  }

  chooseTrip (e) {
    this.setState({
      plannedIndex: e.target.selectedIndex
    })
  }

  render () {
    return (
      <div>
        <div className='activityOverview'>
          <p>Activity: {this.props.activity.title || ''}</p>
          <img src={this.props.activity.image} alt={this.props.activity.title} />
          <p>Date: {moment(this.props.activity.date).format('YYYY-MM-DD') || ''}</p>
          <p>City: {this.props.activity.locality || ''}</p>
          <p>Country: {this.props.activity.country || ''}</p>
          <p>Caption: {this.props.activity.caption || ''}</p>
          <Rating stars={this.props.activity.rating} isEnabled={false} />

          {this.props.plannedKeys.length === 0 &&
            <label>
              <input value={this.state.newPlannedTitle} type='text' placeholder='New trip title' onChange={this.handlePlannedTitle} />
              <button onClick={() => this.addActivityToNewPlanned()}>Add activity</button>
            </label>
          }

          {!this.state.isNewPlanned && this.props.plannedKeys.length > 0 &&
            <div>
              <label>
                Add to plan:
                <select onChange={(e) => this.chooseTrip(e)}>
                  {this.props.options}
                </select>
                <button onClick={() => this.addActivityToExisting()}>Add activity</button>
                <p>or <button onClick={() => this.switchNewPlanned()}>Plan a brand new trip</button></p>
              </label>
            </div>
          }

          {this.state.isNewPlanned && this.props.plannedKeys.length > 0 &&
            <div>
              <label>
                <input value={this.state.newPlannedTitle} type='text' placeholder='New trip title' onChange={this.handlePlannedTitle} />
                <button onClick={() => this.addActivityToNewPlanned()}>Add to new plan</button>
              </label>
              <p>or <button onClick={() => this.switchNewPlanned()}>Add to an existing plan</button></p>
            </div>
          }

          <button onClick={() => this.removeActivity()}>Unsave</button>
        </div>
      </div>
    )
  }
}

export default SavedOverview
