import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Login from '../login/Login'
import Home from '../home/Home'
import SearchResults from '../search/SearchResults'
import New from '../new/New'
import Trips from '../trip/Trips'
import TestTrip from '../trip/TestTrip'
import Profile from '../user/Profile'
import Planned from '../planned/Planned'
import Saved from '../saved/Saved'
import {auth, storageKey, isAuthenticated} from '../../utils/firebase'
import search from '../../utils/search'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: ''
    }
    this.search = search.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.linkToSearch = null
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
  }

  handleSearch (e) {
    if (e.key === 'Enter') {
      this.linkToSearch.handleClick(new window.MouseEvent('click'))
    }
  }

  render () {
    return (
      <Router>
        <div>
          <Nav onChange={this.search} onKeyUp={(e) => this.handleSearch(e)} linkToSearch={(ref) => { this.linkToSearch = ref }} />
          <Route exact path='/' component={Home} />
          <Route path='/search' component={() => <SearchResults searchQuery={this.state.searchQuery} />} />
          <Route path='/new' component={New} />
          <Route path='/planned' component={Planned} />
          <Route path='/saved' component={Saved} />
          <PrivateRoute exact path='/trips' component={Trips} />
          <PrivateRoute path='/trips/:id' component={TestTrip} />
          <Route path='/profile' component={Profile} />
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
