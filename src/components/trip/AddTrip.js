import React from 'react'
import db, {auth} from '../../utils/firebase'

class AddTrip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tripTitle: null,
      tripDetails: null
    }
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleChangeDetails = this.handleChangeDetails.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChangeTitle (e) {
    this.setState({
      tripTitle: e.target.value
    })
  }

  handleChangeDetails (e) {
    this.setState({
      tripDetails: e.target.value
    })
  }

  handleClick () {
    let trips = db.ref('trips/' + auth.currentUser.uid)
    let newRef = trips.push()
    let key = newRef.key
    console.log(key);
    newRef.set({
      date: Date.now(),
      title: this.state.tripTitle,
      details: this.state.tripDetails
    })
    // let key = newRef.key
    let obj = {}
obj[key] = true
    // newRef.set({
    //   date: Date.now(),
    //   title: this.state.tripTitle,
    //   details: this.state.tripDetails
    // })
    // trips.on('child_changed', (data) => {
      db.ref('users/' + auth.currentUser.uid + '/trips').push(obj)
    // })

    // console.log(newRef.key);
  }

  render () {
    return (
      <div>
        {/* <form> */}
          <input onChange={(e) => this.handleChangeTitle(e)} placeholder='Trip Title' />
          <textarea onChange={(e) => this.handleChangeDetails(e)} placeholder='Trip Details' />
          <button onClick={this.handleClick}>Add Trip</button>
        {/* </form> */}
      </div>
    )
  }

}

export default AddTrip
