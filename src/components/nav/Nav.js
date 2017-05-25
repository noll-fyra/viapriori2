import React from 'react'
import {Link} from 'react-router-dom'
import SearchForm from '../search/SearchForm'
import {isAuthenticated, storageKey, storageEmail, auth} from '../../utils/firebase'

class Nav extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isAuthenticated: isAuthenticated()
    }
    this.logOut = this.logOut.bind(this)
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid)
        window.localStorage.setItem(storageEmail, user.email)
        this.setState({
          isAuthenticated: true
        })
      } else {
        window.localStorage.removeItem(storageKey)
        window.localStorage.removeItem(storageEmail)
        this.setState({
          isAuthenticated: false
        })
      }
    })
  }

  logOut () {
    auth.signOut()
    this.setState({
      isAuthenticated: false
    })
  }

  render () {
    return (
      <nav className='topNav'>
        <Link to='/'>VIA PRIORI</Link>
        <SearchForm placeholder='Search' onChange={this.props.onChange} onKeyUp={this.props.onKeyUp} />
        <Link to='/search' className='searchButton' ref={this.props.linkToSearch} style={{display: 'none'}} />
        <Link to='/new'>+NEW</Link>
        <Link to='/planned'>Planned</Link>
        <Link to='/saved'>Saved</Link>
        <Link to='/profile'>Profile</Link>
        {!this.state.isAuthenticated &&
        <span>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </span>
        }
        {this.state.isAuthenticated &&
        <Link to='/' onClick={this.logOut}>Logout</Link>
        }
      </nav>
    )
  }
}
export default Nav
