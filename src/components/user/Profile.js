import React from 'react'
import db, {auth} from '../../utils/firebase'
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
      imageURL: "Add Profile Picture"
    }
  }
  // componentDidMount () {
  //   db.ref('users/' + auth.currentUser.uid).on('value', (snapshot) => {
  //     console.log(snapshot)
  //     console.log(snapshot.val())
  //     this.setState({
  //       username: auth.currentUser.username,
  //       email: auth.currentUser.email,
  //     })
  //   })
  // }
  addProfilePic(e) {
console.log(e.target.files[0])
console.log(e.target)
console.log(e.target.value)
console.log(e.target.files[0].name)
    db.ref('users/' + auth.currentUser.uid+ '/details').update({
      profileURL: e.target.value
      // dob: null,
      // tripsCompleted: [],
      // tripsSaved: [],
      // tripsFavourited: [],
      // following: [],
      // followedBy: []
    })
    this.setState({
      profileURL: e.target.value

    })
  }
  render () {
    // const trips = this.state.tripDisplayed.filter((trip) => { return trip.includes(this.state.searchQuery) })
    return (
      <div>

        <h1> User Profile</h1>

        <div className='profileDiv'>
          <label className = 'profile'>
            <span>{this.state.imageURL}</span>
            <input className='fileInput' type='file' onChange={(e) => this.addProfilePic(e)} />
          </label>
        </div>


        {/* <h2> Name: {auth.currentUser.username}</h2>
        <h2> email: {auth.currentUser.email}</h2> */}

        {/* <ProfileDetails profileDetails={profile} /> */}
        {/* <TripOverview tripItems={trips} /> */}
      </div>
    )
  }
}

export default Profile
