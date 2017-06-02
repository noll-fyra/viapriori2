import React from 'react'
import Flash from '../flash/Flash'
import updateDB from '../../utils/updateDB'
import './planActivity.css'

class PlanActivity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false,
      message: '',
      isNewPlanned: !this.props.plannedKeys.length,
      newPlannedTitle: '',
      plannedIndex: 0
    }
    this.switchNewPlanned = this.switchNewPlanned.bind(this)
    this.handlePlannedTitle = this.handlePlannedTitle.bind(this)
    this.addActivityToNewPlanned = this.addActivityToNewPlanned.bind(this)
    this.addActivityToExisting = this.addActivityToExisting.bind(this)
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
    if (this.hasErrors()) {
      return
    } else {
      let newPlannedID = this.props.createNewPlanned(this.state.newPlannedTitle)
      this.setState({
        newPlannedTitle: ''
      })
      updateDB('planned/' + newPlannedID + '/activities', this.props.activityID, true)
    }
  }

  addActivityToExisting () {
    if (this.hasErrors()) {
      return
    } else {
      this.setState({
        newPlannedTitle: ''
      })
      updateDB('planned/' + this.props.plannedKeys[this.state.plannedIndex] + '/activities', this.props.activityID, true)
    }
  }

  chooseTrip (e) {
    this.setState({
      plannedIndex: e.target.selectedIndex
    })
  }

  hasErrors () {
    let self = this
    let hasErrors = false
    function errorMessage (message) {
      self.setState({
        error: true,
        message: message
      })
      hasErrors = true
    }
    if (!this.state.newPlannedTitle && this.state.isNewPlanned) {
      errorMessage('A valid trip title is required')
    }
    return hasErrors
  }

  render () {
    return (
      <div>
        {this.state.error &&
        <Flash message={this.state.message} />
        }
        {this.props.plannedKeys.length === 0 &&
          <div className='planActivity'>
            <div className='planDiv'>
              <input value={this.state.newPlannedTitle} type='text' placeholder='New trip title' onChange={this.handlePlannedTitle} />
              <button onClick={() => this.addActivityToNewPlanned()}>Add activity</button>
            </div>
            <div />
          </div>
          }

        {!this.state.isNewPlanned && this.props.plannedKeys.length > 0 &&
        <div className='planActivity'>
          <div className='planDiv'>
            <span>Add to plan:</span>
            <select onChange={(e) => this.chooseTrip(e)}>
              {this.props.options}
            </select>
            <button onClick={() => this.addActivityToExisting()}>Add activity</button>
          </div>
          <div>or <button onClick={() => this.switchNewPlanned()}>Plan a brand new trip</button></div>
        </div>
          }

        {this.state.isNewPlanned && this.props.plannedKeys.length > 0 &&
        <div className='planActivity'>
          <div className='planDiv'>
            <input value={this.state.newPlannedTitle} type='text' placeholder='New trip title' onChange={this.handlePlannedTitle} />
            <button onClick={() => this.addActivityToNewPlanned()}>Add to new plan</button>
          </div>
          <div>or <button onClick={() => this.switchNewPlanned()}>Add to an existing plan</button></div>
        </div>
          }
      </div>
    )
  }

}

export default PlanActivity
