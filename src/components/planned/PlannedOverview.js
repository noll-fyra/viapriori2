import React from 'react'
import {Link} from 'react-router-dom'
import './planned.css'

// import db, {storageKey} from '../../utils/firebase'
// onClick={() => props.changeTripId()}
const PlannedOverview = (props) => {
  return (
    <div className='plannedOverview'>
      <div>
      <Link to={'/planned/' + props.tripID}>
          <button>{props.trip.title || ''}</button>
          {/* <img src={props.trip.image} alt={props.trip.title || ''} /> */}
      </Link>
    </div>
      <div>
        <img onClick={() => props.removePlanned(props.tripID)} className='navIcon' src={require('./delete.png')} />
      </div>
    </div>
  )
}

export default PlannedOverview
