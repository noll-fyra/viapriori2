import React from 'react'
import {Link} from 'react-router-dom'
import SearchForm from '../search/SearchForm'
import {isAuthenticated, storageKey, auth} from '../../utils/firebase'
import './nav.css'

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
        this.setState({
          isAuthenticated: true
        })
      } else {
        window.localStorage.removeItem(storageKey)
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
        <Link to='/'>Via Postale</Link>
        <SearchForm placeholder='Search' value={this.props.searchValue} onChange={this.props.onChange} onKeyUp={this.props.onKeyUp} />
        <Link to={'/search'} className='searchButton' ref={this.props.linkToSearch} style={{display: 'none'}} />

        {!this.state.isAuthenticated &&
          <span>
            <Link to='/auth' onClick={() => this.props.isLogin(true)}>Login</Link>
            <Link to='/auth' onClick={() => this.props.isLogin(false)}>Register</Link>
          </span>
        }

        {this.state.isAuthenticated &&
          <span className='sideNav'>
            <img onClick={() => this.props.addNewActivity(true)} className='newIcon' src={require('./new_by_setyo_from_noun_project.png')} />
            <Link to='/saved'><img className='savedIcon' src={require('./saved_by_ayasofya_from_noun_project.png')} /></Link>
            <Link to='/profile'>
              <img className='profileIcon' src={require('./profile_by_icongeek_from_noun_project.png')} />
            </Link>
            <Link to='/' onClick={this.logOut}><img className='logoutIcon' src={require('./logout_by_myladkings_from_noun_project.png')} /></Link>

          </span>
        }
      </nav>
    )
  }
}
export default Nav
