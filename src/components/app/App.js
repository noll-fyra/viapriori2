import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import LoginNav from '../loginnav/LoginNav'
import Login from '../login/Login'
import TripList from '../triplist/TripList'
import Trips from '../trip/Trips'
import TestTrip from '../trip/TestTrip'
import UserProfile from '../userprofile/UserProfile'
import PlannedList from '../plannedtrips/PlannedTripsList'
import FavoritesList from '../favoriteslist/FavoritesList'
import db, {auth, storageKey, isAuthenticated} from '../../utils/firebase'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      database: null
    }
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

  render () {
    return (
      <Router>
        <div>
          <Nav />
          {/* <LoginNav profile={this.props.profile} planned={this.props.planned} favorites={this.props.favorites} trips={this.props.trips} /> */}
          <Route exact path='/' component={() => <TripList trips={this.props.trips} />} />


          <Route path='/planned' component={() => <PlannedList planned={this.props.planned} />} />
          <Route path='/favorites' component={() => <FavoritesList favorites={this.props.favorites} />} />

          <PrivateRoute exact path='/trips' component={Trips} />
          <PrivateRoute path='/trips/:id' component={TestTrip} />
          <Route path='/profile' component={() => <UserProfile profile={this.props.profile} />} />
          <Route path='/login' component={Login} />
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
