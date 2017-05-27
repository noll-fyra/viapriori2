import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Login from '../auth/Login'
import Register from '../auth/Register'
import Home from '../home/Home'
import SearchResults from '../search/SearchResults'
import NewActivity from '../activity/NewActivity'
import TripActivities from '../activity/TripActivities'
import Trips from '../trip/Trips'
import MyActs from '../trip/MyActs'
import Planned from '../planned/Planned'
import Saved from '../saved/Saved'
import {auth, storageKey, storageEmail, isAuthenticated, logOut} from '../../utils/firebase'
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
        window.localStorage.setItem(storageEmail, user.email)
      } else {
        window.localStorage.removeItem(storageKey)
        window.localStorage.removeItem(storageEmail)
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
          <Nav isAuthenticated={isAuthenticated()} logOut={logOut} onChange={this.search} onKeyUp={(e) => this.handleSearch(e)} linkToSearch={(ref) => { this.linkToSearch = ref }} />
          <Route exact path='/' component={Home} />
          <Route path='/search' component={() => <SearchResults searchQuery={this.state.searchQuery} />} />
          <Route path='/new' component={() => <NewActivity />} />
          <PrivateRoute path='/planned' component={Planned} />
          <PrivateRoute path='/saved' component={Saved} />
          <Route path='/activities' component={MyActs} />
          <PrivateRoute exact path='/profile' component={Trips} />
          <PrivateRoute path='/trips/:title/:id' component={TripActivities} />
          {/* <PrivateRoute path='/profile' component={Profile} /> */}
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          {/* <Route path='"trips/"+{props.tripID}' component={TripActivities}/> */}
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
