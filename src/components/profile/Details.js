import React from 'react'
import {Link} from 'react-router-dom'
import fixOrientation from 'fix-orientation'
import db, {storage, storageKey} from '../../utils/firebase'
import updateDB from '../../utils/updateDB'

class Details extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasUpdatedProfileImage: false,
      updatedProfileImage: require('./profile_by_jivan_from_noun_project.png'),
      isFollowing: false
    }
    this.handleFollow = this.handleFollow.bind(this)
    this.handleUnfollow = this.handleUnfollow.bind(this)
    this.addProfileImage = this.addProfileImage.bind(this)
  }

  componentDidMount () {
    this.setState({
      isFollowing: this.props.currentUser.following ? !!this.props.currentUser.following[this.props.userID] : false
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      isFollowing: nextProps.currentUser.following ? !!nextProps.currentUser.following[nextProps.userID] : false
    })
  }

  handleFollow () {
    updateDB('users/' + window.localStorage[storageKey] + '/following', this.props.userID, true)
    updateDB('users/' + this.props.userID + '/followers', window.localStorage[storageKey], true)
    this.setState({
      isFollowing: true
    })
  }

  handleUnfollow () {
    db.ref('users/' + this.props.userID + '/followers/' + window.localStorage[storageKey]).remove()
    db.ref('users/' + window.localStorage[storageKey] + '/following/' + this.props.userID).remove()
    this.setState({
      isFollowing: false
    })
  }

  addProfileImage (e) {
    let image = e.target.files[0]
  // show user the locally uploaded file
    const reader = new window.FileReader()
    reader.addEventListener('load', () => {
      let self = this
      fixOrientation(reader.result, { image: true }, function (fixed, newImage) {
        self.setState({
          updatedProfileImage: fixed,
          hasUpdatedProfileImage: true
        })
      // upload the file to firebase
        storage.ref(window.localStorage[storageKey] + '/profile/avatar').putString(self.state.updatedProfileImage, 'data_url').then((snap) => {
          storage.ref(window.localStorage[storageKey] + '/profile/avatar').getDownloadURL().then((url) => {
          // update the profileImage url
            db.ref('users/' + window.localStorage[storageKey] + '/profile').update({
              profileImage: url
            })
            if (self.props.currentUser.profile && self.props.currentUser.profile.username) {
              updateDB('usernames/', self.props.currentUser.profile.username, url)
            }
          })
        })
      })
    })
    reader.readAsDataURL(image)
  }

  render () {
    return (
      <div className='profileContainer'>
        <div className='profileImageDiv'>
          {this.props.userID === window.localStorage[storageKey] && this.props.type === 'profile' &&
          <label className='profileImage' style={{backgroundImage: `url(${this.state.hasUpdatedProfileImage ? this.state.updatedProfileImage : this.props.user.profile && this.props.user.profile.profileImage ? this.props.user.profile.profileImage : require('./profile_by_jivan_from_noun_project.png')})`, backgroundSize: 'cover'}}>
            <span className='changeAvatar'>Change avatar</span>
            <input className='fileInput' type='file' onChange={(e) => this.addProfileImage(e)} accept={'image/*'} />
          </label>
          }

          {this.props.userID === window.localStorage[storageKey] && this.props.type !== 'profile' &&
          <Link to='/profile'>
            <label className='profileImage' style={{backgroundImage: `url(${this.props.user.profile && this.props.user.profile.profileImage ? this.props.user.profile.profileImage : require('./profile_by_jivan_from_noun_project.png')})`, backgroundSize: 'cover'}} />
          </Link>
          }

          {this.props.userID !== window.localStorage[storageKey] &&
            <Link to={'/users/' + this.props.userID}>
              <label className='profileImage' style={{backgroundImage: `url(${this.props.user.profile && this.props.user.profile.profileImage ? this.props.user.profile.profileImage : require('./profile_by_jivan_from_noun_project.png')})`, backgroundSize: 'cover'}} />
            </Link>
          }
        </div>

        <div className='profileDetails'>
          <div className='profileUsername'>{this.props.user.profile && this.props.user.profile.username ? this.props.user.profile.username : 'user'}</div>

          {this.props.type === 'profile' &&
          <div>
            <span><b>{this.props.user.trips ? Object.keys(this.props.user.trips).length : 0}</b> trips</span>{'   '}
            <Link to={'/users/' + this.props.userID + '/following'} style={{cursor: 'pointer'}}><b>{this.props.user.following ? Object.keys(this.props.user.following).length : 0}</b> following</Link>{'   '}
            <Link to={'/users/' + this.props.userID + '/followers'} style={{cursor: 'pointer'}}><b>{this.props.user.followers ? Object.keys(this.props.user.followers).length : 0}</b> followers</Link>
          </div>
          }

          {this.props.type !== 'profile' &&
          <div>
            <span><b>{this.props.user.trips ? Object.keys(this.props.user.trips).length : 0}</b> trips</span>{'   '}
            <b>{this.props.user.following ? Object.keys(this.props.user.following).length : 0}</b> following{'   '}
            <b>{this.props.user.followers ? Object.keys(this.props.user.followers).length : 0}</b> followers
          </div>
          }

          {this.props.userID !== window.localStorage[storageKey] && !this.state.isFollowing &&
            <div><button onClick={() => this.handleFollow()}>Follow</button></div>
          }
          {this.props.userID !== window.localStorage[storageKey] && this.state.isFollowing &&
            <div><button onClick={() => this.handleUnfollow()}>Unfollow</button></div>
          }
        </div>
      </div>
    )
  }
}

export default Details
