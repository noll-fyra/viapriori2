import React from 'react'
import db, {storageKey} from '../../utils/firebase'
import ActivityOverview from './ActivityOverview'

class TripActivities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activities: [],
      activityArray: []
    }
  }

  componentDidMount () {
    db.ref('trips/' + this.props.match.params.id + '/activities').once('value').then((snapshot) => {
      let activityArray = Object.keys(snapshot.val())
      this.setState({
        activityArray: activityArray
      })

      let temp = activityArray.slice()
      for (var activity in snapshot.val()) {
        let ind = activityArray.indexOf(activity)
        db.ref('activities/' + activity).once('value').then((snap) => {
          temp[ind] = snap.val()
          this.setState({
            activities: temp
          })
        })
      }
    })
  }

  saveActivity (e) {
    let savedActivityID = e.target.name
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[savedActivityID] = true
      db.ref('users/' + window.localStorage[storageKey] + '/saved').set(newObj)
    })
  }

  render () {
    return (
      <div>
        <h1>Activities for {this.props.match.params.title} </h1>
        {this.state.activities &&
          this.state.activities.map((activity, index) => {
            return <ActivityOverview key={this.state.activityArray[index]} activityID={this.state.activityArray[index]} activity={activity} handleSaveActivity={(e) => this.saveActivity(e)} />
          })
        }
      </div>
    )
  }
}

export default TripActivities
