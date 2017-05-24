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
      // image: 'a'
    }
    this.addProfilePic = this.addProfilePic.bind(this)

  }
  componentWillMount () {
    db.ref('users/' + auth.currentUser.uid).on('value', (snapshot) => {

      this.setState({
        imageName: snapshot.val().details.imageName,
        imagePath: snapshot.val().details.imagePath,
        username: snapshot.val().details.username,
        email: snapshot.val().details.email,
        image: snapshot.val().details.image

      })
    })
  }
//   componentDidUpdate(){
//   // only update chart if the data has changed
//     storage.refFromURL('gs://via-priori.appspot.com/'+this.state.imagePath).getDownloadURL().then((url) => {
//       console.log(this.state.image,'this state image')
//       console.log(this.state.username, 'username')
//       console.log(url, 'url')
//       if (this.state.image !== url) {
//       this.setState({
//         image: url
//       })
//       console.log('done')
//     }
//     })
// }


  addProfilePic(e) {

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

    storage.ref(auth.currentUser.uid + '/profile/images/' + image.name).put(image).then((snap) => {
      // console.log(url)
      db.ref('users/' + auth.currentUser.uid +'/details').update({
        imageName: image.name,
        imagePath: auth.currentUser.uid + '/profile/images/' + image.name
      })
      this.displayProfile()
    })
  }

  displayProfile(){
    console.log('start')
    storage.refFromURL('gs://via-priori.appspot.com/'+this.state.imagePath).getDownloadURL().then((url) => {
      // console.log(this.state.image,'this state image')
      console.log(this.state.username, 'username')
      console.log(url, 'url')
      db.ref('users/' + auth.currentUser.uid +'/details').update({
        image: url
      })
    })
  }

  render () {
// console.log(this.state.image)
// console.log(this.state.username)
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
<h4> Email: {auth.currentUser.email}</h4>
      </div>
       //
      //
      //   <ProfileDetails profileDetails={profile} />
      //  <TripOverview tripItems={trips} />
    )
  }
}

export default Profile
