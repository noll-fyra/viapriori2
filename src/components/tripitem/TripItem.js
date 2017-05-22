import React from 'react';

const TripItem = (props) => (
    <ul>
      {
        props.tripItems.map((trip,index)=>{
          return <div onClick={props.tripDetails} key={index} name={index} >{trip}</div>
        })
      }
    </ul>

    
);


export default TripItem;
