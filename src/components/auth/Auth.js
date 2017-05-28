import React from 'react'
import {Redirect} from 'react-router-dom'
import db, {auth} from '../../utils/firebase'

class Auth extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: props.isLogin,
      email: '',
      password: '',
      username: '',
      currentUser: auth.currentUser,
      redirectToReferrer: false
    }
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.intentionToLogin = this.intentionToLogin.bind(this)
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

  handleUsername (e) {
    this.setState({
      username: e.target.value
    })
  }

  handleLogin () {
    const authPromise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      this.setState({
        currentUser: auth.currentUser,
        redirectToReferrer: true
      })
    })
    .catch((error) => { console.log(error.message) })
  }

  handleSignup () {
    const authPromise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      db.ref('users/' + auth.currentUser.uid + '/profile').set({
        email: this.state.email,
        uid: auth.currentUser.uid,
        username: this.state.username
      })
      this.setState({
        currentUser: auth.currentUser,
        redirectToReferrer: true
      })
      console.log(auth.currentUser.uid)
    })
    .catch((error) => { console.log(error.message) })
  }

  intentionToLogin (bool) {
    this.setState({
      isLogin: bool
    })
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
        {this.state.currentUser &&
        <p>Signed in as: {this.state.currentUser.email}</p>
        }

        {!this.state.currentUser && from.pathname !== '/' &&
        <p>You must log in to view the page at {from.pathname}</p>
        }

        {!this.state.currentUser && this.state.isLogin &&
          <div>
            <label>
              <input id='login-email' type='text' onChange={(e) => this.handleEmail(e)} placeholder='email' />
              <input id='login-password' type='password' onChange={(e) => this.handlePassword(e)} placeholder='password' />
            </label>
            <button id='login-button' onClick={this.handleLogin}>Login</button>
            <button id='signup-button' onClick={() => this.intentionToLogin(false)}>Or Sign Up</button>
          </div>
        }
        {!this.state.currentUser && !this.state.isLogin &&
        <div>
          <label>
            <input id='login-username' type='text' onChange={(e) => this.handleUsername(e)} placeholder='username' />
            <input id='login-email' type='text' onChange={(e) => this.handleEmail(e)} placeholder='email' />
            <input id='login-password' type='password' onChange={(e) => this.handlePassword(e)} placeholder='password' />
          </label>
          <button id='signup-button' onClick={this.handleSignup}>Sign Up</button>
          <button id='login-button' onClick={() => this.intentionToLogin(true)}>Or Login</button>
        </div>
        }
      </div>
    )
  }
}

export default Auth
