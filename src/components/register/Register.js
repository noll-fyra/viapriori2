import React from 'react'
import {Link, Redirect} from 'react-router-dom'
// import {Link} from 'react-router-dom'
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
    this.handleUsername = this.handleUsername.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
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
      // this.linkToRegister.handleClick(new window.MouseEvent('click'))
    // }

    //
    const authPromise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    authPromise
    .then((user) => {
      db.ref('users/' + auth.currentUser.uid+ '/details').set({
        email: this.state.email,
        uid: auth.currentUser.uid,
        username: this.state.username,
        // dob: null,
        // tripsCompleted: [],
        // tripsSaved: [],
        // tripsFavourited: [],
        // following: [],
        // followedBy: []
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
        {/* {this.state.currentUser &&
        <p>{this.state.currentUser.email}</p>
        }
        {!this.state.currentUser &&
        <p>You must log in to view the page at {from.pathname}</p>
        } */}

        {!this.state.currentUser &&
          <div>
            <label>
              <input id='login-username' type='text' onChange={(e) => this.handleUsername(e)} placeholder='username'/>
              <input id='login-email' type='text' onChange={(e) => this.handleEmail(e)} placeholder='email'/>
              <input id='login-password' type='password' onChange={(e) => this.handlePassword(e)} placeholder='password' />
            </label>
            <button id='signup-button' onClick={(e)=> this.handleSignup(e)}>Sign Up</button>
            <Link to='/register' className='registerButton' ref={(ref) => { this.linkToRegister = ref }} style={{display: 'none'}} />

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
