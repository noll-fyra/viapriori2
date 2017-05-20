import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Nav from '../nav/Nav'
import Login from '../login/Login'
import Database from '../database/Database'
import AddTrip from '../trip/AddTrip'
import MyTrips from '../trip/MyTrips'
import db, {auth, storageKey, isAuthenticated} from '../../utils/firebase'

const jerel = db.ref('jerel')
const jonathan = db.ref('jonathan')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      database: null
    }
    this.updateJerel = this.updateJerel.bind(this)
    this.updateJon = this.updateJon.bind(this)
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid)
        this.setState({uid: user.uid})
      } else {
        window.localStorage.removeItem(storageKey)
        this.setState({uid: null})
      }

    })
console.log(auth.currentUser);
    db.ref().on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
    })
  }

  updateJerel () {
    jerel.child('-KkRJiM2djzl30ZLfi9T').remove()
    // this.props.jerel.child('-KkRJiM2djzl30ZLfi9T').once('value', thing=>{
    //   console.log(thing.val());
    // })
  }

  updateJon () {
    jonathan.push({jonathan: 1})
  }

  render () {
    return (
      <Router>
        <div>
          <Nav />
          <Route path='/login' component={Login} />
          <Route path='/database' component={() => <Database database={this.state.database} />} />
          {/* <Route path='/myTrips' component={() => <MyTrips database={this.state.database} />} /> */}
          <PrivateRoute path='/myTrips' component={()=><MyTrips names='thomas' />}  />
          {/* <Route path='/addTrip' component={AddTrip} /> */}
          <PrivateRoute path='/addTrip' component={AddTrip} />
          {/* <MatchWhenAuthorized pattern='/protected' component={AddTrip} /> */}
          {/* jerel:
          <button onClick={this.updateJerel}>addJerel</button>
          jonathan:
          <button onClick={this.updateJon}>addJonathan</button> */}

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
