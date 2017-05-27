import React from 'react'
import db, {storage, storageKey, storageEmail} from '../../utils/firebase'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: '',
      searchQuery: '',
      imagePath: '',
      imageName: '',
      username: '',
      email: '',
      image: ''
    }
    this.addProfilePic = this.addProfilePic.bind(this)
  }
  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey]).once('value').then((snapshot) => {
      if (snapshot.val()) {
        this.setState({
          imageName: snapshot.val().details.imageName || null,
          imagePath: snapshot.val().details.imagePath || null,
          username: snapshot.val().details.username,

          email: snapshot.val().details.email,
          image: snapshot.val().details.image
        })
      }
    })
  }

  addProfilePic (e) {
    let image = e.target.files[0]
    // var reader = new window.FileReader()
    // reader.addEventListener('load', () => {
    //   this.setState({
    //     image: reader.result
    //   })
    // })
    // reader.readAsDataURL(image)
    //
    // this.setState({
    //   imagePath: image,

    //   imageName: image.name
    // })

    storage.ref(window.localStorage[storageKey] + '/profile/images/').put(image).then((snap) => {
      db.ref('users/' + window.localStorage[storageKey] + '/details').update({
        imageName: image.name,
        imagePath: window.localStorage[storageKey] + '/profile/images/'
      })
      this.setState({
        imageName: image.name,
        imagePath: window.localStorage[storageKey] + '/profile/images/'
      })
      this.displayProfile()
    })
  }

  displayProfile () {
    storage.refFromURL('gs://via-priori.appspot.com/' + this.state.imagePath).getDownloadURL().then((url) => {
      db.ref('users/' + window.localStorage[storageKey] + '/details').update({
        image: url
      })

      this.setState({
        image: url
      })
    })
  }

  render () {
    return (
      <div>
        <h1> User Profile</h1>

        {this.state.imagePath === '' &&
        <div className='profileDiv'>
          <label className='profile'>
            <span>{this.state.imageName}</span>
            <input className='fileInput' type='file' onChange={(e) => this.addProfilePic(e)} />
          </label>
        </div>
        }

        {this.state.imagePath !== '' &&
          <div className='profileDiv'>
            <label className='profile' style={{backgroundImage: `url(${this.state.image})`, backgroundSize: 'cover'}}>
              <span className='editImage'>Edit Image</span>
              <input className='fileInput' type='file' onChange={(e) => this.addProfilePic(e)} />
            </label>
          </div>
        }

        <div className='profileDetails'>
          <h4> Name: {this.state.username}</h4>
          <h4> Email: {window.localStorage[storageEmail]}</h4>
        </div>
      </div>
    )
  }
}

export default Profile
