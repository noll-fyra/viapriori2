import React from 'react';

const UserProfileDetails = (props) => (
    <ul>
      {
        props.profileDetails.map((profileDetails,index)=>{
          return <div key = {index}>{profileDetails}</div>
        })
      }
    </ul>
);


export default UserProfileDetails;
