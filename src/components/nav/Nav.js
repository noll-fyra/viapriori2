import React from 'react';
import {Link} from 'react-router-dom'

const Nav = (props) => (
  <nav>
    <Link to='/login'>Login</Link>
    <Link to='/database'>Database</Link>
    <Link to='/myTrips'>My Trips</Link>
    <Link to='/addTrip'>Add Trip</Link>
  </nav>
)

export default Nav
