import React from 'react'
import {Link} from 'react-router-dom'
// import db, {storageKey} from '../../utils/firebase'

const UserOverview = (props) => {
  return (
    <div>
      <Link to={'/users/'+props.userID}>
          <div className='profileContainer'>
            <div className='profileImageDiv'>

              <label className='profileImage' style={{backgroundImage: `url(${props.user.profile.profileImage})`, backgroundSize: 'cover'}} />
            </div>
          </div>
          <div className='profileDetails'>
            <div className='profileUsername'>{props.user.profile.username}</div>
            {/* <div>
              <span><b>{props.numberOfTrips}</b> trips</span>{'   '}
              <span><b>{props.following}</b> following</span>{'   '}
              <span><b>{props.followers}</b> followers</span>
            </div> */}
          </div>

      </Link>
    </div>
  )
}

export default UserOverview
