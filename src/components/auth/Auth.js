import React from 'react'
import {Redirect} from 'react-router-dom'
import Flash from '../flash/Flash'
import db, {auth} from '../../utils/firebase'
import updateDB from '../../utils/updateDB'

class Auth extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: props.isLogin,
      allUsernames: {},
      error: false,
      message: '',
      email: null,
      password: null,
      username: null,
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

  componentDidMount () {
    db.ref('usernames').on('value', (snap) => {
      let allUsernames = snap.val() || {}
      this.setState({
        allUsernames: allUsernames
      })
    })
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
    if (!this.state.email || !this.state.password) {
      this.setState({
        error: true,
        message: 'Please fill in all the fields',
        username: null,
        password: null,
        email: null
      })
      return
    }
    const authPromise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      this.setState({
        currentUser: auth.currentUser,
        redirectToReferrer: true
      })
    })
    .catch((error) => {
      // console.log(error.message)
      this.setState({
        error: true,
        message: error.message,
        username: null,
        password: null,
        email: null
      })
    })
  }

  handleSignup () {
    if (!this.state.email || !this.state.password || !this.state.username) {
      this.setState({
        error: true,
        message: 'Please fill in all the fields'
      })
      return
    }
    if (Object.values(this.state.allUsername).includes(this.state.username)) {
      this.setState({
        error: true,
        message: 'That username is already taken.',
        username: null
      })
      return
    }
    const authPromise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      db.ref('users/' + auth.currentUser.uid + '/profile').set({
        email: this.state.email,
        uid: auth.currentUser.uid,
        username: this.state.username
      })
      updateDB('usernames', auth.currentUser.uid, this.state.username)
      this.setState({
        currentUser: auth.currentUser,
        redirectToReferrer: true
      })
    })
    .catch((error) => {
      this.setState({
        error: true,
        message: error.message
      })
    })
  }

  intentionToLogin (bool) {
    this.setState({
      isLogin: bool
    })
    this.setState({
      error: false,
      username: null,
      email: null,
      password: null
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

        {this.state.error &&
        <Flash message={this.state.message} />
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
