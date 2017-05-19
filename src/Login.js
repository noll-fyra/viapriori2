import React from 'react'
// import * as firebase from 'firebase'
import {auth} from './firebaseThing'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      currentUser: auth.currentUser
    }
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleEmail (e) {
    this.setState({
      email: e.target.value
    })
  }

  handlePassword (e) {
    this.setState({
      password: e.target.value
    })
  }

  handleLogin (e) {
    // const auth = firebase.auth()
    const authPromise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      console.log(user.email)
      this.setState({
        currentUser: auth.currentUser
      })
    })
    .catch((error) => { console.log(error.message) })
  }

  handleSignup (e) {
    // const auth = firebase.auth()
    const authPromise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      console.log(user)
      this.setState({
        currentUser: auth.currentUser
      })
    })
    .catch((error) => { console.log(error.message) })
  }

  handleLogout (e) {
    // const auth = firebase.auth()
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
    return (
      <div>
        {!this.state.currentUser &&
          <div>
            <label>
              Type your email and password
              <input id='login-email' type='text' onChange={(e) => this.handleEmail(e)} placeholder='email' />
              <input id='login-password' type='password' onChange={(e) => this.handlePassword(e)} placeholder='password' />
            </label>

            <button id='login-button' onClick={(e) => this.handleLogin(e)}>Login</button>
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

export default Login
