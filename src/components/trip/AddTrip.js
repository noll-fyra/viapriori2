import React from 'react'
import db, {auth} from '../../utils/firebase'

class AddTrip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: null,
      details: null,
      start: null,
      end: null

    }
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleChangeDetails = this.handleChangeDetails.bind(this)
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
    this.handleClick = this.handleClick.bind(this)
    // this.close = this.close.bind(this)
  }

  handleChangeTitle (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleChangeDetails (e) {
    this.setState({
      details: e.target.value
    })
  }

  handleChangeStart (e) {
    this.setState({
      start: e.target.value
    })
  }

  handleChangeEnd (e) {
    this.setState({
      end: e.target.value
    })
  }

  handleClick () {
    let trips = db.ref('trips')
    let newRef = trips.push()
    newRef.set({
      user: auth.currentUser.uid,
      title: this.state.title,
      details: this.state.details,
      start: this.state.start,
      end: this.state.end
    })
    let key = newRef.key

    db.ref('users/' + auth.currentUser.uid + '/trips').once('value', snap => {
      let newObj = snap.val() || {}
      newObj[key] = true
      db.ref('users/' + auth.currentUser.uid + '/trips').set(newObj)
    })
    window.location = '/trips/' + key
  }

  render () {
    if (!this.props.isOpen) {
      return null
    }
    return (
      <div>
        <div className='backdrop' onClick={this.props.onClose} />
        <div className='modal'>
          <input type='text' onChange={(e) => this.handleChangeTitle(e)} placeholder='Where did you go?' />
          <input type='date' onChange={(e) => this.handleChangeStart(e)} placeholder='Start Date' />
          <input type='date' onChange={(e) => this.handleChangeEnd(e)} placeholder='End Date' />
          <textarea onChange={(e) => this.handleChangeDetails(e)} placeholder='Trip Details' />
          <button onClick={this.handleClick}>Add Trip</button>
          <button onClick={this.props.onClose}>Close Modal</button>
        </div>
      </div>
    )
  }

}

export default AddTrip
