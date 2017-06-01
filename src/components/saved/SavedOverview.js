import React from 'react'
import moment from 'moment'
import db from '../../utils/firebase'
import ActivityOverview from '../activity/ActivityOverview'

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
    this.addSavedToAllAndTrending = this.addSavedToAllAndTrending.bind(this)
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
    this.addSavedToAllAndTrending()
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
    this.addSavedToAllAndTrending()
  }

  addSavedToAllAndTrending () {
    db.ref('all/saved/' + this.props.activityID).once('value').then((snap) => {
      db.ref('all/saved/' + this.props.activityID).set(snap.val() + 1 || 1)
    })
    db.ref('trending/saved/' + moment().format('dddd') + '/' + this.props.activityID).once('value').then((snap) => {
      db.ref('trending/saved/' + moment().format('dddd') + '/' + this.props.activityID).set(snap.val() + 1 || 1)
    })
  }

  chooseTrip (e) {
    this.setState({
      plannedIndex: e.target.selectedIndex
    })
  }

  render () {
    return (
      <div>
        <ActivityOverview
          activity={this.props.activity}
          activityID={this.props.activityID}
          clickToSearch={this.props.clickToSearch}
          user={this.props.activity.user}
          username={this.props.username || 'user'}
          image={this.props.image || ''}
          areImagesHidden={false}
          type='saved'
       />
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
      </div>
    )
  }
}

export default SavedOverview
