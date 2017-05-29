import React from 'react'
import {Link} from 'react-router-dom'
// import db, {storageKey} from '../../utils/firebase'

const UserOverview = (props) => {
  return (
    <div>
      <Link to={'/users/'+props.userID}>
          <div className='profileContainer'>
            <div className='profileImageDiv'>

              <label className='profileImage' style={{backgroundImage: `url(${props.user.details.image})`, backgroundSize: 'cover'}} />
            </div>
          </div>
          <div className='profileDetails'>
            <div className='profileUsername'>{props.user.details.username}</div>
            {/* <div>
              <span><b>{props.numberOfTrips}</b> trips</span>{'   '}
              <span><b>{props.following}</b> following</span>{'   '}
              <span><b>{props.followed}</b> followed</span>
            </div> */}
          </div>
  
      </Link>
    </div>
  )
}

export default UserOverview
