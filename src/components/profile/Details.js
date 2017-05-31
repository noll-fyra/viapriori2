import React from 'react'
import {Link} from 'react-router-dom'
import {storageKey} from '../../utils/firebase'

const Details = (props) => (
  <div className='profileContainer'>
    <div className='profileImageDiv'>
      {props.userID === window.localStorage[storageKey] &&
      <label className='profileImage' style={{backgroundImage: `url(${props.hasUpdatedProfileImage ? props.updatedProfileImage : props.user.profile && props.user.profile.profileImage ? props.user.profile.profileImage : require('./profile_by_jivan_from_noun_project.png')})`, backgroundSize: 'cover'}}>
        <span className='changeAvatar'>Change avatar</span>
        <input className='fileInput' type='file' onChange={(e) => props.addProfileImage(e)} accept={'image/*'} />
      </label>
      }

      {props.userID !== window.localStorage[storageKey] &&
      <label className='profileImage' style={{backgroundImage: `url(${props.user.profile && props.user.profile.profileImage ? props.user.profile.profileImage : require('./profile_by_jivan_from_noun_project.png')})`, backgroundSize: 'cover'}} />
      }
    </div>

    <div className='profileDetails'>
      <div className='profileUsername'>{props.user.profile && props.user.profile.username ? props.user.profile.username : 'user'}</div>
      <div>
        <span><b>{props.user.trips ? Object.keys(props.user.trips).length : 0}</b> trips</span>{'   '}
        <Link to={'/users/' + props.userID + '/following'} style={{cursor: 'pointer'}}><b>{props.user.following ? Object.keys(props.user.following).length : 0}</b> following</Link>{'   '}
        <Link to={'/users/' + props.userID + '/followers'} style={{cursor: 'pointer'}}><b>{props.user.followers ? Object.keys(props.user.followers).length : 0}</b> followers</Link>
      </div>

      {props.userID !== window.localStorage[storageKey] && !props.isFollowing &&
        <div><button onClick={() => props.handleFollow()}>Follow</button></div>
      }
      {props.userID !== window.localStorage[storageKey] && props.isFollowing &&
        <div><button onClick={() => props.handleUnfollow()}>UnFollow</button></div>
      }
    </div>
  </div>
)

export default Details
