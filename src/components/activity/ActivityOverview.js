import React from 'react'
import {Link} from 'react-router-dom'

const ActivityOverview = (props) => {
  return (
    <div>
      {/* <Link to={'trips/' + props.tripID}> */}
        <div className='activityOverview'><p>{props.trip.title || ''}</p><img src={props.image} alt={props.trip.title} /></div>
      {/* </Link> */}
    </div>
  )
}

export default ActivityOverview
