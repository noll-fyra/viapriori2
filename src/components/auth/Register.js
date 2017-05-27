import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import db, {auth} from '../../utils/firebase'

class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      username: '',
      redirectToReferrer: false
    }
    this.handleUsername = this.handleUsername.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    // this.handleLogout = this.handleLogout.bind(this)
    this.linkToRegister = null
  }

  handleUsername (e) {
    this.setState({
      username: e.target.value
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

  handleSignup (e) {
    const authPromise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      db.ref('users/' + auth.currentUser.uid + '/details').set({
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

  render () {
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from} />
      )
    }
    return (
      <div>
        <div>
          <label>
            <input id='login-username' type='text' onChange={(e) => this.handleUsername(e)} placeholder='username' />
            <input id='login-email' type='text' onChange={(e) => this.handleEmail(e)} placeholder='email' />
            <input id='login-password' type='password' onChange={(e) => this.handlePassword(e)} placeholder='password' />
          </label>
          <button id='signup-button' onClick={(e) => this.handleSignup(e)}>Sign Up</button>
          <Link to='/register' className='registerButton' ref={(ref) => { this.linkToRegister = ref }} style={{display: 'none'}} />

        </div>
      </div>
    )
  }
}

export default Register
