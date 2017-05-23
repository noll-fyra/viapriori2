import React from 'react'
import {Redirect} from 'react-router-dom'
import db, {auth} from '../../utils/firebase'

class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      username: '',
      // currentUser: auth.currentUser,
      redirectToReferrer: false
    }
    this.handleEmail = this.handleEmail.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    // this.handleLogin = this.handleLogin.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleEmail (e) {
    this.setState({
      email: e.target.value
    })
  }

  handleUsername (e) {
    this.setState({
      username: e.target.value
    })
  }
  handlePassword (e) {
    this.setState({
      password: e.target.value
    })
  }

  // handleLogin (e) {
  //   const authPromise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
  //   authPromise
  //   .then((user) => {
  //     console.log(user.email)
  //     this.setState({
  //       currentUser: auth.currentUser,
  //       redirectToReferrer: true
  //     })
  //     console.log(auth.currentUser.uid)
  //   })
  //   .catch((error) => { console.log(error.message) })
  // }

  handleSignup (e) {
    const authPromise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      db.ref('users').push({
        email: this.state.email,
        uid: auth.currentUser.uid,
        username: this.state.username,
        tripsCompleted: [],
        tripsSaved: [],
        tripsFavourited: [],
        following: [],
        followedBy: []
      })
      this.setState({
        currentUser: auth.currentUser,
        redirectToReferrer: true
      })
      console.log(auth.currentUser.uid)
    })
    .catch((error) => { console.log(error.message) })
  }

  handleLogout (e) {
    const authPromise = auth.signOut()
    authPromise
    .then((user) => {
      this.setState({
        currentUser: auth.currentUser
      })
    })
    .catch((error) => { console.log(error.message) })
  }

  render () {
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from} />
      )
    }
    return (
      <div>

        {!this.state.currentUser &&
          <div>
            <label>
              <input id='login-email' type='text' onChange={(e) => this.handleEmail(e)} placeholder='email' />
              <input id='login-username' type='text' onChange={(e) => this.handleUsername(e)} placeholder='username' />
              <input id='login-password' type='password' onChange={(e) => this.handlePassword(e)} placeholder='password' />
            </label>

            <button id='signup-button' onClick={(e) => this.handleSignup(e)}>Sign Up</button>
          </div>
        }
        {this.state.currentUser &&
          <button id='logout-button' onClick={(e) => this.handleLogout(e)}>Log Out</button>
      }
      </div>
    )
  }
}

export default Register
