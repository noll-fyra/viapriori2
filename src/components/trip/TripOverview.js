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
      <div className='tripOverviewBackdrop' />
      <img className='tripOverviewImage' src={props.trip.image} alt={props.trip.title} />
      <div className='tripOverviewDetails'>
        {/* <div className='heading'> */}
          <h4 className='heading'>{props.trip.title|| ''} ({length()})</h4>
          {/* <h5 className='subheading'>  {length()}</h5> */}
          {/* <h6 className='heading'>{length()}</h6> */}
          <h5 className='heading'>{averageRating()}</h5>
        {/* </div> */}
      </div>
      </Link>
    </div>
  )
}

export default TripOverview
