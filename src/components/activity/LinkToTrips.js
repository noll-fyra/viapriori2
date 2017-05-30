import React from 'react'
import {Link} from 'react-router-dom'
import db, {storageKey} from '../../utils/firebase'

const LinkToTrips = (props) => {
  return (

    <div>
          <Link to={'/trips/' + props.activity.trip}>View Full Trip</Link>
    </div>
    )
    }

    export default LinkToTrips
