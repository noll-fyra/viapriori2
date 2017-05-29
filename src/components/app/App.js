import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Auth from '../auth/Auth'
import Home from '../home/Home'
import SearchResults from '../search/SearchResults'
import NewActivity from '../activity/NewActivity'
import Trip from '../trip/Trip'
import Profile from '../profile/Profile'
import Saved from '../saved/Saved'
import {auth, storageKey, isAuthenticated, logOut} from '../../utils/firebase'
import search from '../../utils/search'
import suggestions from '../../utils/suggestions'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: '',
      addNewActivity: false
    }
    this.search = search.bind(this)
    this.addNewActivity = this.addNewActivity.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.linkToSearch = null
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid)
      } else {
        window.localStorage.removeItem(storageKey)
      }
    })
  }

  addNewActivity (bool) {
    this.setState({
      addNewActivity: bool
    })
  }

  handleSearch (e) {
    if (e.key === 'Enter') {
      this.linkToSearch.handleClick(new window.MouseEvent('click'))
    }
  }

  handleLogin (bool) {
    this.setState({
      isLogin: bool
    })
  }

  render () {
    return (
      <Router>
        <div>
          <Nav
            addNewActivity={this.addNewActivity}
            isAuthenticated={isAuthenticated()}
            isLogin={this.handleLogin}
            logOut={logOut}
            onChange={this.search}
            onKeyUp={(e) => this.handleSearch(e)}
            linkToSearch={(ref) => { this.linkToSearch = ref }}
          />
          <Route exact path='/' component={Home} />
          <Route path='/search' component={() => <SearchResults searchQuery={this.state.searchQuery} />} />
          <PrivateRoute path='/saved' component={Saved} />
          <PrivateRoute exact path='/profile' component={(props) => <Profile isCurrentUser={true} {...props} />} />
          <Route path='/users/:id' component={(props) => <Profile isCurrentUser={false} {...props} />} />
          <PrivateRoute path='/trips/:id' component={Trip} />
          <Route path='/auth' component={(props) => <Auth isLogin={this.state.isLogin} {...props} />} />
          <NewActivity isEnabled={this.state.addNewActivity} addNewActivity={this.addNewActivity} suggestions={suggestions} />
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
        pathname: '/auth',
        state: {
          from: props.location,
          isLogin: this.state.isLogin
        }
      }} />
    )
  )} />
)

export default App
