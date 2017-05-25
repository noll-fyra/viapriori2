import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Login from '../auth/Login'
import Register from '../auth/Register'
import Home from '../home/Home'
import SearchResults from '../search/SearchResults'
import NewActivity from '../activity/NewActivity'
import Trips from '../trip/Trips'
import MyActs from '../trip/MyActs'
import Planned from '../planned/Planned'
import Saved from '../saved/Saved'
import {auth, storageKey, isAuthenticated, logOut} from '../../utils/firebase'
import search from '../../utils/search'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: ''
      // uid: null
    }
    this.search = search.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.linkToSearch = null
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid)
        // this.setState({
        //   uid: user.uid
        // })
      } else {
        window.localStorage.removeItem(storageKey)
        // this.setState({
        //   uid: null
        // })
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
          <Route path='/planned' component={Planned} />
          <Route path='/saved' component={Saved} />
          <Route path='/activities' component={MyActs} />
          <PrivateRoute exact path='/profile' component={Trips} />
          {/* <PrivateRoute path='/trips/:id' component={TestTrip} /> */}
          {/* <PrivateRoute path='/profile' component={Profile} /> */}
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
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
