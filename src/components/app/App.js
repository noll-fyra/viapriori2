import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Auth from '../auth/Auth'
import Home from '../home/Home'
import SearchResults from '../search/SearchResults'
import NewActivity from '../activity/NewActivity'
import Trip from '../trip/Trip'
import Profile from '../profile/Profile'
import Follow from '../follow/Follow'
import PlannedActivities from '../planned/PlannedActivities'
import Saved from '../saved/Saved'
import db, {auth, storageKey, isAuthenticated, logOut} from '../../utils/firebase'
import search from '../../utils/search'
import suggestions from '../../utils/suggestions'
import './app.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: '',
      addNewActivity: false,
      currentTrip: null,
      currentUser: {}
    }
    this.search = search.bind(this)
    this.addNewActivity = this.addNewActivity.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.clickToSearch = this.clickToSearch.bind(this)
    this.setCurrentTrip = this.setCurrentTrip.bind(this)
    this.linkToSearch = null
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid)
        db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
          this.setState({
            currentUser: snapshot.val()
          })
        })
      } else {
        window.localStorage.removeItem(storageKey)
        this.setState({
          currentUser: {}
        })
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
      this.setState({
        searchQuery: this.state.searchQuery.toLowerCase()
      })
      this.linkToSearch.handleClick(new window.MouseEvent('click'))
    }
  }

  handleLogin (bool) {
    this.setState({
      isLogin: bool
    })
  }

  clickToSearch (query) {
    this.setState({
      searchQuery: query.toLowerCase()
    })
    this.linkToSearch.handleClick(new window.MouseEvent('click'))
  }

  setCurrentTrip (trip) {
    this.setState({
      currentTrip: trip
    })
  }

  render () {
    return (
      <Router>
        <div className='router'>
          <Nav
            addNewActivity={this.addNewActivity}
            isAuthenticated={isAuthenticated()}
            isLogin={this.handleLogin}
            logOut={logOut}
            onChange={this.search}
            searchValue={this.state.searchQuery}
            onKeyUp={(e) => this.handleSearch(e)}
            linkToSearch={(ref) => { this.linkToSearch = ref }}
          />
          {/* <div className='topNav topNavBG' /> */}

          <div className='bodyContainer'>
            <Route exact path='/' component={() => <Home clickToSearch={this.clickToSearch} />} />
            <Route path='/search' component={(props) => <SearchResults searchQuery={this.state.searchQuery} clickToSearch={this.clickToSearch} {...props} />} />
            <PrivateRoute path='/saved' component={Saved} />
            <Route exact path='/profile' component={(props) => <Profile currentUser={this.state.currentUser} {...props} />} />
            <Route exact path='/users/:id' component={(props) => <Profile currentUser={this.state.currentUser} {...props} />} />
            <Route path='/users/:id/following' component={(props) => <Follow currentUser={this.state.currentUser} type={'following'} {...props} />} />
            <Route path='/users/:id/followers' component={(props) => <Follow currentUser={this.state.currentUser} type={'followers'} {...props} />} />
            <PrivateRoute path='/planned/:id' component={PlannedActivities} />
            <PrivateRoute path='/trips/:id' component={(props) => <Trip clickToSearch={this.clickToSearch} currentTrip={this.state.currentTrip} {...props} />} />
            <Route path='/auth' component={(props) => <Auth isLogin={this.state.isLogin} {...props} />} />
            <NewActivity isEnabled={this.state.addNewActivity} addNewActivity={this.addNewActivity} suggestions={suggestions} setCurrentTrip={this.setCurrentTrip} />
          </div>
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
