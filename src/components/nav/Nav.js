import React from 'react'
import {Link} from 'react-router-dom'

const Nav = (props) => (
  <nav>
    <Link to='/login'>Login</Link>
    <Link to='/database'>Database</Link>
    <Link to='/trips'>My Trips</Link>
  </nav>
)

export default Nav
