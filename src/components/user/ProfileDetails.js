import React from 'react'

const ProfileDetails = (props) => (
  <ul>
    {
      props.profileDetails.map((profileDetails, index) => {
        return <div key={index}>{profileDetails}</div>
      })
    }
  </ul>
)

export default ProfileDetails
