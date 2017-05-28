import React from 'react'
import db from '../../utils/firebase'
import ActivityOverview from '../activity/ActivityOverview'

class Trip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activities: [],
      keys: [],
      details: {}
    }
  }

  componentDidMount () {
    db.ref('trips/' + this.props.match.params.id).on('value', snapshot => {
      let tripDetails = snapshot.val()
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
    })
  }

  render () {
    return (
      <div>
        <h1>Activities for {this.state.details.title || ''} </h1>
        {this.state.activities &&
          this.state.activities.map((activity, index) => {
            return <ActivityOverview key={this.state.keys[index]} activityID={this.state.keys[index]} activity={activity} />
          })
        }
      </div>
    )
  }
}

export default Trip
