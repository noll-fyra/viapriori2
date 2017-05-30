import React from 'react'

const Details = (props) => (
  <div className='profileContainer'>
    <div className='profileImageDiv'>
      {props.isCurrentUser &&
      <label className='profileImage' style={{backgroundImage: `url(${props.profileImage})`, backgroundSize: 'cover'}}>
        <span className='changeAvatar'>Change avatar</span>
        <input className='fileInput' type='file' onChange={(e) => props.addProfileImage(e)} accept={'image/*'} />
      </label>
    }
      {!props.isCurrentUser &&
      <label className='profileImage' style={{backgroundImage: `url(${props.profileImage})`, backgroundSize: 'cover'}} />
    }
    </div>

    <div className='profileDetails'>
      <div className='profileUsername'>{props.username}</div>
      <div>
        <span style={{cursor: 'pointer'}} onClick={() => props.changeShowing('trips')}><b>{props.numberOfTrips}</b> trips</span>{'   '}
        <span style={{cursor: 'pointer'}} onClick={() => props.changeShowing('following')}><b>{props.following}</b> following</span>{'   '}
        <span style={{cursor: 'pointer'}} onClick={() => props.changeShowing('followed')}><b>{props.followed}</b> followed</span>
      </div>

      {!props.isCurrentUser && !props.isFollowing &&
        <div><button onClick={() => props.handleFollow(props.userID)}>Follow</button></div>
      }
      {!props.isCurrentUser && props.isFollowing &&
        <div><button onClick={() => props.handleUnfollow(props.userID)}>UnFollow</button></div>
      }
    </div>
  </div>
)

export default Details
