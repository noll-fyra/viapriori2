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
      <div className='tripOverviewDetails'>
        {/* <div className='heading'> */}
          <h3>{props.trip.title|| ''}</h3>
          <h5 className='subheading'>  {length()}</h5>
          <h3>{averageRating()}</h3>
        {/* </div> */}
        {/* <h5>{length()}</h5> */}
      </div>
        <img className='tripOverviewImage' src={props.trip.image} alt={props.trip.title} />
      </Link>
    </div>
  )
}

export default TripOverview
