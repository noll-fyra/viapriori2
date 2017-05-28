import React from 'react'
import {Link} from 'react-router-dom'

const PlannedOverview = (props) => {

  return (
    <div>
      <Link to={'planned/' + props.tripID}>
        <div className='tripOverview'>
          <p>{props.trip.title || ''} </p>
          <img src={props.trip.image} alt={props.trip.title} />
        </div>
      </Link>
    </div>
  )
}

export default PlannedOverview
