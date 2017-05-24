import React from 'react'
import db, {auth, storage} from '../../utils/firebase'


class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: '',
      searchQuery: '',
      imagePath: '',
      // imageName: 'Add Profile Picture',
      image: ''
    }
    this.addProfilePic = this.addProfilePic.bind(this)

  }
  componentDidMount () {
    db.ref('users/' + auth.currentUser.uid).on('value', (snapshot) => {

      this.setState({
        imageName: snapshot.val().details.imageName,
        imagePath: snapshot.val().details.imagePath,
          username: snapshot.val().details.username,
            email: snapshot.val().details.email,

      })
      this.displayProfile()
    })
  }
      displayProfile(){
        var storageRef = storage.ref();
        storageRef.child(this.state.imagePath).getDownloadURL().then((url) => {
          console.log(url)
          this.setState({
            image:url
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

    storage.ref(auth.currentUser.uid + '/profile/images/' + image.name).put(image).then((snap) => {
      // console.log(url)
      db.ref('users/' + auth.currentUser.uid +'/details').update({
        imageName: image.name,
        imagePath: auth.currentUser.uid + '/profile/images/' + image.name
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
