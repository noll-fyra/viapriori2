import React from 'react'
import TripList from '../triplist/TripList'
import UserProfile from '../userprofile/UserProfile'
import PlannedList from '../plannedtrips/PlannedTripsList'
import FavoritesList from '../favoriteslist/FavoritesList'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const LoginNav = (props) => (

  <Router>
    <div>
      <Link to='/'>Home</Link>{' '}
      <Link to='/profile'>Profile</Link>{' '}
      <Link to='/planned'>Planned Trips</Link>{' '}
      <Link to='/favorites'>Favorites</Link>
      <Route exact path='/' component={() => <TripList trips={props.trips} />} />
      <Route path='/profile' component={() => <UserProfile profile={props.profile} />} />
      <Route path='/planned' component={() => <PlannedList planned={props.planned} />} />
      <Route path='/favorites' component={() => <FavoritesList favorites={props.favorites} />} />

    </div>
  </Router>

)

export default LoginNav
