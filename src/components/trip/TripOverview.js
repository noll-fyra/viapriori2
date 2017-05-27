import React from 'react'
import {Link} from 'react-router-dom'

const TripOverview = (props) => {
  function averageRating () {
    if (!props.trip.activities) {
      return 10
    }
    return parseFloat(props.trip.totalRating / Object.keys(props.trip.activities).length).toFixed( 1 )
  }
  return (
    <div>
      <Link to={'trips/' + props.trip.title + '/' + props.tripID}>
        <div className='tripOverview'><p>{props.trip.title || ''} <span>Ratings:{averageRating()}</span></p><img src={props.trip.image} alt={props.trip.title} /></div>
      </Link>
    </div>
  )
}

export default TripOverview
