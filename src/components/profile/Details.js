import React from 'react'

const Details = (props) => (
  <div className='profileContainer'>
    <div className='profileImageDiv'>
      <label className='profileImage' style={{backgroundImage: `url(${props.profileImage})`, backgroundSize: 'cover'}}>
        <span className='changeAvatar'>Change avatar</span>
        <input className='fileInput' type='file' onChange={(e) => props.addProfileImage(e)} />
      </label>
    </div>

    <div className='profileDetails'>
      <div className='profileUsername'>{props.username}</div>
      <div><span><b>{props.numberOfTrips}</b> trips</span>{'   '}<span><b>12</b> followers</span>{'   '}<span><b>42</b> following</span></div>
      <div><button>Edit</button></div>
    </div>
  </div>
)

export default Details
