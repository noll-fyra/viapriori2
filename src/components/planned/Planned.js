import React from 'react'
import db, {storageKey} from '../../utils/firebase'
import PlannedOverview from './PlannedOverview'

class Planned extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plannedKeys: props.plannedKeys,
      plannedTrips: props.plannedTrips
    }
    this.removePlanned = this.removePlanned.bind(this)
  }

  removePlanned (id) {
    db.ref('planned/' + id).remove()
    db.ref('users/' + window.localStorage[storageKey] + '/planned/' + id).remove()
  }

  render () {
    return (
      <div>
        <h1> Planned Trips</h1>
        {this.props.plannedKeys &&
            this.props.plannedTrips.map((trip, index) => {
              return <PlannedOverview key={this.props.plannedKeys[index]} tripID={this.props.plannedKeys[index]} trip={trip} removePlanned={this.removePlanned} />
            })
          }
      </div>
    )
  }
}

export default Planned
