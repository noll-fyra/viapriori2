import React from 'react'
import {Link} from 'react-router-dom'
import Details from '../profile/Details'
import {storageKey} from '../../utils/firebase'

class Follow extends React.Component {
  render () {
    return (
      <div>
        {this.props.users.map((user, index) => {
          return <Link onClick={() => this.props.updateCurrentUser(this.props.userKeys[index])} key={this.props.userKeys[index]} to={this.props.userKeys[index] === window.localStorage[storageKey] ? '/profile' : '/users/' + this.props.userKeys[index]}>
            <Details
              userID={this.props.userKeys[index]}
              username={user.profile && user.profile.username ? user.profile.username : 'user'}
              profileImage={user.profile && user.profile.profileImage ? user.profile.profileImage : require('../profile/profile_by_jivan_from_noun_project.png')}
              numberOfTrips={user.trips ? Object.keys(user.trips).length : 0}
              addProfileImage={doNothing}
              isCurrentUser={false}
              changeShowing={doNothing}
              isFollowing={user.followed ? Object.keys(user.followed).includes(window.localStorage[storageKey]) : false}
              following={user.following ? Object.keys(user.following).length : 0}
              followed={user.followed ? Object.keys(user.followed).length : 0}
              handleFollow={this.props.handleFollow}
              handleUnfollow={this.props.handleUnfollow}
          /></Link>
        })
      }
      </div>
    )
  }
}

function doNothing () {

}

export default Follow
