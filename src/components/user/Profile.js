import React from 'react'
import db, {auth, storage} from '../../utils/firebase'
// import search from '../../utils/search'
// import SearchForm from '../search/SearchForm'
// import TripOverview from '../trip/TripOverview'
// import ProfileDetails from './ProfileDetails'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: '',
      searchQuery: '',
      imagePath: '',
      imageName: 'Add Profile Picture',
      image: ''
    }
    this.addProfilePic = this.addProfilePic.bind(this)

  }
  componentDidMount () {
    db.ref('users/' + auth.currentUser.uid).on('value', (snapshot) => {
      this.setState({
        username: snapshot.val().details.username,
        email: snapshot.val().details.email,
        image: snapshot.val().details.image
      })
    })

  }
  addProfilePic(e) {

    let image = e.target.files[0]
    var reader = new window.FileReader()
    reader.addEventListener('load', () => {
      this.setState({
        image: reader.result
      })
    })
    reader.readAsDataURL(image)

    this.setState({
      imagePath: image,
      imageName: image.name
    })

      storage.ref(auth.currentUser.uid + '/profile/images/' + this.state.imageName).put(this.state.imagePath).then((snap) => {
        db.ref('users/' + auth.currentUser.uid +'/details').push({
          image: auth.currentUser.uid + '/profile/images/' + this.state.imageName,
        })
      })


  }
  render () {
    console.log(this.state.imagePath)
    console.log(this.state.imageName)
    // console.log(this.state.image)
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
        <div className = 'profileDiv'>

          <label className='profile' style={{backgroundImage: `url(${this.state.image})`, backgroundSize: 'cover'}}>
            <span className='editImage'>Edit Image</span>
            <input className='fileInput' type='file' onChange={(e) => this.addProfilePic(e)} />
          </label>
        </div>
}


<h4> Name: {this.state.username}</h4>
<h4> email: {auth.currentUser.email}</h4>
      </div>
       //
      //
      //   <ProfileDetails profileDetails={profile} />
      //  <TripOverview tripItems={trips} />
    )
  }
}

export default Profile
