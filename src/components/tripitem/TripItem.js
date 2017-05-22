import React from 'react';

const TripItem = (props) => (
    <ul>
      {
        props.tripItems.map((trip,index)=>{
          
          return <div onClick={props.tripDetails} key={index} name={index}> {trip}</div>

          // let path = '/trips/' + keys[index]
          // return (
          //   <li key={keys[index]}>
          //     <p><Link to={path}>name: {trip.title}</Link></p>
        })
      }
    </ul>


);


export default TripItem;
