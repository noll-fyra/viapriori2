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
      <nav>
        <div className='logoNav'>
          <Link to='/' className='logoNav'>
            <img className='logo' src={require('./logo.png')} alt='Via Postale' />
            <div className='viaPostale'>Via Postale</div>
          </Link>
        </div>

        <div className='searchNav'>
          <SearchForm className='searchForm' placeholder='Search for anything' value={this.props.searchValue} onChange={this.props.onChange} onKeyUp={this.props.onKeyUp} />
          <Link to={'/search'} className='searchButton' ref={this.props.linkToSearch} style={{display: 'none'}} />
          {/* <img className='searchIcon' src={require('./search_by_deepz_from_noun_project.png')} alt='search_by_deepz_from_noun_project.png' /> */}
          {/* </Link> */}
        </div>

        {this.state.isAuthenticated &&
        <div className='newContainer'>
          <Link to='#' className='authenticate' onClick={() => this.props.addNewActivity(true)}>
            {/* <img onClick={() => this.props.addNewActivity(true)} className='navIcon addNewActivity' src={require('./new_by_setyo_from_noun_project.png')} /> */}
            +New Activity
          </Link>
        </div>
        }

        {!this.state.isAuthenticated &&
        <div />
        }

        <div className='sideNav'>
          {!this.state.isAuthenticated &&
          <div className='notAuthenticatedContainer'>
            <Link className='authenticate' to='/auth' onClick={() => this.props.isLogin(true)}>Login</Link>
            <Link className='authenticate' to='/auth' onClick={() => this.props.isLogin(false)}>Register</Link>
          </div>
        }

          {this.state.isAuthenticated &&
          <div className='authenticatedContainer'>
            <Link className='authenticate' to='/saved'>
              {/* <img className='navIcon' src={require('./saved_by_ayasofya_from_noun_project.png')} /> */}
              Saved
            </Link>
            <Link className='authenticate' to='/profile'>
              {/* <img className='navIcon' src={require('./profile_by_icongeek_from_noun_project.png')} /> */}
              Profile
            </Link>
            <Link className='authenticate' to='/' onClick={this.logOut}>
              {/* <img className='navIcon' src={require('./logout_by_myladkings_from_noun_project.png')} /> */}
              Logout
            </Link>
          </div>
        }
        </div>
      </nav>
    )
  }
}
export default Nav
