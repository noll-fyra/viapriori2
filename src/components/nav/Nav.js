import React from 'react'
import {Link} from 'react-router-dom'
import SearchForm from '../search/SearchForm'
import {isAuthenticated} from '../../utils/firebase'

const Nav = (props) => (
  <nav className='topNav'>
    <Link to='/'>VIA PRIORI</Link>
    <SearchForm placeholder='Search' onChange={props.onChange} onKeyUp={props.onKeyUp} />
    <Link to='/search' className='searchButton' ref={props.linkToSearch} style={{display: 'none'}} />
    <Link to='/new'>+NEW</Link>
    <Link to='/planned'>Planned</Link>
    <Link to='/saved'>Saved</Link>
    <Link to='/trips'>Profile</Link>
    {/* <Link to='/profile'>Profile</Link> */}
    {!isAuthenticated() &&
      <span>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
      </span>
    }
    {isAuthenticated() &&
    <Link to='/' onClick={props.logOut}>Logout</Link>
    }
  </nav>
)

export default Nav
