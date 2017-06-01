import React from 'react'
// import {Link} from 'react-router-dom'
import Details from '../profile/Details'
import db from '../../utils/firebase'
import './follow.css'

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
              follows.push(snapshot.val() ? [key, snapshot.val()] : [null, 'user'])
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
              follows.push(snapshot.val() ? [key, snapshot.val()] : [null, 'user'])
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
        currentUser={this.props.currentUser}
        userID={item[0]}
        user={item[1]}
        type={this.state.type}
      />
    })
    return (
      <div>
        <div className='detailsContainer'>
          <div />
          <Details
            key={this.state.userID}
            currentUser={this.props.currentUser}
            userID={this.state.userID}
            user={this.state.user}
            type='profile'
          />
          <div />
        </div>
        <h1 className='following'>{this.state.type === 'following' ? 'Following' : 'Followers'}</h1>
        <div className='detailsContainer'>
          <div />
          {follows}
          <div />
        </div>
      </div>
    )
  }
}

export default Follow
