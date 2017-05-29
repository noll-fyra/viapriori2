import React from 'react'
import Details from '../profile/Details'

class Follow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      users: props.users
    }
  }
  render () {
    return (
      <div>
        {this.props.users.map((user, index) => {
          return <Details
            key={index}
            username={user.username}
            profileImage={user.profileImage}
            numberOfTrips={user.trips.length}
            addProfileImage={() => {}}
            isCurrentUser={false}
            changeShowing={{}}
            isFollowing={{}}
            following={user.following ? user.following.length : 0}
            followed={user.followed ? user.followed.length : 0}
            handleFollow={() => {}}
            handleUnfollow={() => {}}
          />
        })
      }
      </div>
    )
  }

}

export default Follow
