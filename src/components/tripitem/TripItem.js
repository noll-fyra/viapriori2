import React from 'react';
import {Link} from 'react-router-dom'
const TripItem = (props) => (
    <ul>
      {
        props.tripItems.map((trip,index)=>{
          let path = '/trips/' + props.tripId[index]

          return <div key = {index}><Link to={path}> {trip}</Link></div>

        })
      }
    </ul>


);


export default TripItem;
