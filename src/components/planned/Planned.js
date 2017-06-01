import React from 'react'
import PlannedOverview from './PlannedOverview'
import db, {storageKey} from '../../utils/firebase'
import './planned.css'


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
        <h3 className='plannedHeading'> Planned </h3>
        {this.props.plannedKeys.length === 0 &&
          <p className='niltrip'>You currently have no planned trips</p>
        }
        {this.props.plannedKeys &&
            this.props.plannedTrips.map((trip, index) => {
              return <PlannedOverview key={this.props.plannedKeys[index]} tripID={this.props.plannedKeys[index]} trip={trip} removePlanned={this.removePlanned}/>
            })
          }
    </div>
    )
  }
}

export default Planned
