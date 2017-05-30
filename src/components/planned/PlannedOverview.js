import React from 'react'
import {Link} from 'react-router-dom'
// import db, {storageKey} from '../../utils/firebase'
// onClick={() => props.changeTripId()}
const PlannedOverview = (props) => {
  return (
    <div>
      <Link to={'/planned/' + props.tripID}>
        <div className='tripOverview'>
          <p>{props.trip.title || ''} </p>

          {/* <img src={props.trip.image} alt={props.trip.title || ''} /> */}
        </div>
      </Link>
      <button onClick={() => props.removePlanned(props.tripID)}>Remove</button>
    </div>
  )
}

export default PlannedOverview
