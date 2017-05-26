import React from 'react'
import {Link} from 'react-router-dom'

const TripOverview = (props) => {
  return (
    <div>
      <Link to={'trips/' + props.trip.title +'/'+ props.tripID}>
        <div className='tripOverview'><p>{props.trip.title || ''}</p><img src={props.trip.image} alt={props.trip.title} /></div>
      </Link>
    </div>
  )
}

export default TripOverview
