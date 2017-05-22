import React from 'react'
import {Link} from 'react-router-dom'

const Nav = (props) => (
  <nav className='topNav'>
    <Link to='/'>VIA PRIORI</Link>
    <Link to='/planned'>Planned</Link>
    <Link to='/saved'>Saved</Link>
    <Link to='/trips'>My Trips</Link>
    <Link to='/profile'>Profile</Link>
    <Link to='/login'>Login</Link>
  </nav>
)

export default Nav
