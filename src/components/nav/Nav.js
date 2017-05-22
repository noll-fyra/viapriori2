import React from 'react'
import {Link} from 'react-router-dom'
import SearchForm from '../search/SearchForm'

const Nav = (props) => (

  <nav className='topNav'>
    <Link to='/'>VIA PRIORI</Link>
    <SearchForm placeholder='Search' onChange={props.onChange} onKeyUp={props.onKeyUp} />
    <Link to='/search' className='searchButton' ref={props.linkToSearch} style={{display: 'none'}} />
    <Link to='/planned'>Planned</Link>
    <Link to='/saved'>Saved</Link>
    <Link to='/trips'>My Trips</Link>
    <Link to='/profile'>Profile</Link>
    <Link to='/login'>Login</Link>
  </nav>
)

export default Nav
