import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Login from '../login/Login'
import TripList from '../triplist/TripList'
import Trips from '../trip/Trips'
import TestTrip from '../trip/TestTrip'
import UserProfile from '../userprofile/UserProfile'
import PlannedList from '../plannedtrips/PlannedTripsList'
import FavoritesList from '../favoriteslist/FavoritesList'
import db, {auth, storageKey, isAuthenticated} from '../../utils/firebase'

<<<<<<< HEAD
//Jerel's imports
// import TripList from '../triplist/TripList'
import LoginNav from '../loginnav/LoginNav'


// const jerel = db.ref('jerel')
// const jonathan = db.ref('jonathan')

=======
>>>>>>> 2cebe24ff3e9e4919f6005cf4e348ada9c350144
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      database: null
    }
<<<<<<< HEAD
    // this.updateJerel = this.updateJerel.bind(this)
    // this.updateJon = this.updateJon.bind(this)
=======
>>>>>>> 2cebe24ff3e9e4919f6005cf4e348ada9c350144
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid)
        // this.setState({uid: user.uid})
      } else {
        window.localStorage.removeItem(storageKey)
        // this.setState({uid: null})
      }
    })
    db.ref().on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
    })
  }

<<<<<<< HEAD
  // updateJerel () {
  //   jerel.child('-KkRJiM2djzl30ZLfi9T').remove()
    // this.props.jerel.child('-KkRJiM2djzl30ZLfi9T').once('value', thing=>{
    //   console.log(thing.val());
    // })
  // }

  // updateJon () {
  //   jonathan.push({jonathan: 1})
  // }

=======
>>>>>>> 2cebe24ff3e9e4919f6005cf4e348ada9c350144
  render () {
    return (
      <Router>
        <div>
          <Nav />
          <Route exact path='/' component={TripList} />
          <Route path='/planned' component={PlannedList} />
          <Route path='/favorites' component={FavoritesList} />
          <PrivateRoute exact path='/trips' component={Trips} />
          <PrivateRoute path='/trips/:id' component={TestTrip} />
<<<<<<< HEAD
          {/* <PrivateRoute path='/addTrip' component={AddTrip} /> */}
          {/* jerel:
          <button onClick={this.updateJerel}>addJerel</button>
          jonathan:
          <button onClick={this.updateJon}>addJonathan</button> */}
          <LoginNav/>

=======
          <Route path='/profile' component={UserProfile} />
          <Route path='/login' component={Login} />
>>>>>>> 2cebe24ff3e9e4919f6005cf4e348ada9c350144
        </div>
      </Router>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    )
  )} />
)

export default App
