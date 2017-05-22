import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Login from '../login/Login'
import Database from '../database/Database'
import Trips from '../trip/Trips'
// import MyTrips from '../trip/MyTrips'
import TestTrip from '../trip/TestTrip'
import db, {auth, storageKey, isAuthenticated} from '../../utils/firebase'

//Jerel's imports
// import TripList from '../triplist/TripList'
import LoginNav from '../loginnav/LoginNav'


// const jerel = db.ref('jerel')
// const jonathan = db.ref('jonathan')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      database: null
    }
    // this.updateJerel = this.updateJerel.bind(this)
    // this.updateJon = this.updateJon.bind(this)
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
    db.ref().on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
    })
  }

  // updateJerel () {
  //   jerel.child('-KkRJiM2djzl30ZLfi9T').remove()
    // this.props.jerel.child('-KkRJiM2djzl30ZLfi9T').once('value', thing=>{
    //   console.log(thing.val());
    // })
  // }

  // updateJon () {
  //   jonathan.push({jonathan: 1})
  // }

  render () {
    return (
      <Router>
        <div>
          <Nav />
          <Route path='/login' component={Login} />
          <Route path='/database' component={() => <Database database={this.state.database} />} />
          <PrivateRoute exact path='/trips' component={Trips} />
          <PrivateRoute path='/trips/:id' component={TestTrip} />
          {/* <PrivateRoute path='/addTrip' component={AddTrip} /> */}
          {/* jerel:
          <button onClick={this.updateJerel}>addJerel</button>
          jonathan:
          <button onClick={this.updateJon}>addJonathan</button> */}
          <LoginNav/>

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
