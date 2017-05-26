import React from 'react'
import db, {storage, storageKey} from '../../utils/firebase'
import SavedOverview from './SavedOverview'

class Saved extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      savedArray:[],
      savedActivities:[],
    }
  }
  componentDidMount () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snapshot) => {
      this.displayActivity()
    })
  }
      //
      // plannedActivity(e){
      //   let savedActivityID = e.target.name
      //   db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snap) => {
      //     let newObj = snap.val() || {}
      //     newObj[savedActivityID] = true
      //     db.ref('users/' + window.localStorage[storageKey] + '/saved').set(newObj)
      //   })
      // }
  displayActivity () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snapshot) => {
      if (snapshot.val()) {
        let savedArray = Object.keys(snapshot.val())
        this.setState({
          savedArray: savedArray
        })
        let temp = savedArray.slice()
        for (var activity in snapshot.val()) {
          let ind = savedArray.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            temp[ind] = snap.val()
            this.setState({
              savedActivities: temp
            })
          })
        }
      } else {
        this.setState({
          savedActivities: []
        })
      }
    })
  }
  removeActivity (e) {
    let removeActivityID = e.target.name
    db.ref('users/' + window.localStorage[storageKey] + '/saved/' + e.target.name).remove()
        //
    console.log('users/' + window.localStorage[storageKey] + '/saved/' + e.target.name)
    this.displayActivity()
  }

  render () {
      let reverseSaved = this.state.savedActivities.slice().reverse()
    return (
      <div>
        <h1> Saved Activities</h1>
        {!this.state.savedActivities &&
          <p></p>}

        {this.state.savedActivities &&
            reverseSaved.map((activity, index) => {
              return <SavedOverview key={index} activityID={this.state.savedArray[index]} activity={activity} handlePlannedActivity={(e) => this.plannedActivity(e)} handleRemoveSaved={(e) => this.removeActivity(e)} />
            })}
      </div>
    )
  }
}

export default Saved
