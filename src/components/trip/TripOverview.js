import React from 'react'
import {Link} from 'react-router-dom'

const TripOverview = (props) => {
  const trips = props.tripItems.map((trip, index) => {
    let path = 'trips/' + props.tripId[index]
    return <li key={props.tripId[index]}><Link to={path}>{trip}</Link></li>
  })
  return (
    <ul>
      {trips}
    </ul>
  )
}

export default TripOverview
