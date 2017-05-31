import React from 'react'
// import {Link} from 'react-router-dom'
// import Details from '../profile/Details'
import db from '../../utils/firebase'

class Follow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      type: props.type,
      userID: props.match.params.id,
      user: {},
      follows: []
    }
  }
  componentDidMount () {
    db.ref('users/' + this.state.userID).once('value').then(snap => {
      this.setState({
        user: snap.val() || {}
      })
      if (this.state.type === 'following') {
        if (snap.val() && snap.val().following) {
          let keys = Object.keys(snap.val().following)
          let follows = []
          keys.forEach((key) => {
            db.ref('users/' + key).once('value').then((snapshot) => {
              follows.push(snapshot.val() && snapshot.val().profile && snapshot.val().profile.username ? [key, snapshot.val().profile.username] : [null, 'user'])
              this.setState({
                follows: follows
              })
            })
          })
        }
      } else if (this.state.type === 'followers') {
        if (snap.val() && snap.val().followers) {
          let keys = Object.keys(snap.val().followers)
          let follows = []
          keys.forEach((key) => {
            db.ref('users/' + key).once('value').then((snapshot) => {
              follows.push(snapshot.val() && snapshot.val().profile && snapshot.val().profile.username ? [key, snapshot.val().profile.username] : [null, 'user'])
              this.setState({
                follows: follows
              })
            })
          })
        }
      }
    })
  }
  render () {
    const follows = this.state.follows.map((item) => {
      return <Details
        key={item[0]}
        currentUser={this.state.currentUser}
        userID={this.state.userID}
        user={this.state.user}
        hasUpdatedProfileImage={this.state.hasUpdatedProfileImage}
        updatedProfileImage={this.state.updatedProfileImage}
        addProfileImage={this.addProfileImage}
        isFollowing={this.state.isFollowing}
        handleFollow={this.handleFollow}
        handleUnfollow={this.handleUnfollow}
      />
    })
    return (
      <div>
        {/* {JSON.stringify(this.state)} */}
        {follows}
        {/* {this.props.users.map((user, index) => {
          return <Link onClick={() => this.props.updateCurrentUser(this.props.userKeys[index])} key={this.props.userKeys[index]} to={this.props.userKeys[index] === window.localStorage[storageKey] ? '/profile' : '/users/' + this.props.userKeys[index]}>
            <Details
              userID={this.props.userKeys[index]}
              username={user.profile && user.profile.username ? user.profile.username : 'user'}
              profileImage={user.profile && user.profile.profileImage ? user.profile.profileImage : require('../profile/profile_by_jivan_from_noun_project.png')}
              numberOfTrips={user.trips ? Object.keys(user.trips).length : 0}
              addProfileImage={doNothing}
              isCurrentUser={false}
              changeShowing={doNothing}
              isFollowing={user.followers ? Object.keys(user.followers).includes(window.localStorage[storageKey]) : false}
              following={user.following ? Object.keys(user.following).length : 0}
              followers={user.followers ? Object.keys(user.followers).length : 0}
              handleFollow={this.props.handleFollow}
              handleUnfollow={this.props.handleUnfollow}
          /></Link>
        })
      } */}
      </div>
    )
  }
}

export default Follow
