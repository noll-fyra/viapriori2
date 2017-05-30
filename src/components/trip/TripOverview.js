import React from 'react'
import {Link} from 'react-router-dom'
import './tripOverview.css'

const TripOverview = (props) => {
  function averageRating () {
    return !props.trip.activities ? 'No rating' : `${parseFloat(props.trip.totalRating / Object.keys(props.trip.activities).length).toFixed(1)}/5`
  }
  function length () {
    let length = Math.max(Math.round(((props.trip.end - props.trip.start) / (1000 * 60 * 60 * 24)) * 2) / 2, 1)
    return length === 1 ? `${length} day` : `${length} days`
  }
  return (
    <div className='tripOverview'>
      <Link to={'/trips/' + props.tripID}>
        <img className='tripOverviewImage' src={props.trip.image} alt={props.trip.title} />
        <div className='tripOverviewBackdrop' />
        <div className='tripOverviewDetails'>
          <h4>{props.trip.title || ''}</h4>
          <h5>{length()}</h5>
          <h5>{averageRating()}</h5>
        </div>
      </Link>
    </div>
  )
}

export default TripOverview
