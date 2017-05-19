import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Login from './Login'
import Database from './Database'
// import * as firebase from 'firebase'
// const db = firebase.database().ref()
import db from './firebaseThing'
const jerel = db.ref('jerel')
const jonathan = db.ref('jonathan/second')


class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   database: props.database
    // }
    this.updateJerel = this.updateJerel.bind(this)
    this.updateJon = this.updateJon.bind(this)
  }
  updateJerel() {
  jerel.child('-KkRJiM2djzl30ZLfi9T').push({hello:10, mighty: 'duck', where: 'have', you: 'gone'})
    // this.props.jerel.child('-KkRJiM2djzl30ZLfi9T').once('value', thing=>{
    //   console.log(thing.val());
    // })
  }
  updateJon() {
    jonathan.push({jonathan: 1})
  }
  render () {
    return (
      <div className='App'>
        <Login />
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
        </div>
        <div className='App-intro'>
          <Database database={this.props.database} />
          jerel:
          <button onClick={this.updateJerel}>addJerel</button>
          {/* {JSON.stringify(this.props.jerel)} */}
          jonathan:
          <button onClick={this.updateJon}>addJonathan</button>
          {/* {JSON.stringify(this.props.jonathan)} */}
        </div>
      </div>
    )
  }
}

export default App

// const addLocation = data => database.child('locations').push(data, response => response);
// const updateLocation = (id, data) => database.child(`locations/${id}`).update(data, response => response);
// const actions = {
//   addLocation,
//   updateLocation,
// };
