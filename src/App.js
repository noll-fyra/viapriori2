import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Login from './Login'
import Database from './Database'
// import * as firebase from 'firebase'
// const db = firebase.database().ref()
import db from './firebaseThing'
import TripList from './components/triplist/TripList'
import LoginNav from './components/loginnav/LoginNav'
//
// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom'





const jerel = db.ref('jerel')
const jonathan = db.ref('jonathan/second')

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
    // console.log(db.ref());
    db.ref().on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
      // console.log();
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
      <div className='App'>
        <Login />
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React2</h2>
        </div>
        <div className='App-intro'>
          <Database database={this.state.database} />
          jerel:
          <button onClick={this.updateJerel}>addJerel</button>
          {/* {JSON.stringify(this.props.jerel)} */}
          jonathan:
          <button onClick={this.updateJon}>addJonathan</button>
          {/* {JSON.stringify(this.props.jonathan)} */}
        </div>
        <LoginNav profile = {this.props.profile} planned = {this.props.planned} favorites = {this.props.favorites} trips = {this.props.trips}/>
        {/* <TripList trips = {this.props.trips}/> */}
      </div>
    )
  }
}

export default App
