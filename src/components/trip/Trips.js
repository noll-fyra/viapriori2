import React from 'react'
import NewTrip from './NewTrip'
import MyTrips from './MyTrips'
import MyProfile from '../user/Profile'
// import TestTrip from './TestTrip'
// import {BrowserRouter as Router, Route} from 'react-router-dom'


class Trips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      addTripIsOpen: false,
      isAddingImage: props.isAddingImage

    }
    this.openAddTrip = this.openAddTrip.bind(this)
    this.closeAddTrip = this.closeAddTrip.bind(this)
  }

  componentWillMount () {
    // this.props.resetIsAddingImage()
    // console.log(this.props.resetIsAddingImage);
    // if(this.props.isAddingImage) {
    //   console.log(true);
    // } else {
    //   console.log(false);
    // }
    // this.props.resetIsAddingImage()
    // this.openAddTrip()
  }

  openAddTrip () {
    this.setState({
      addTripIsOpen: true
    })
  }

  closeAddTrip () {
    this.setState({
      addTripIsOpen: false
    })
  }

  render () {
    return (
      <div>
        <MyProfile />
        {/* <button onClick={this.openAddTrip}>New Trip</button> */}
        {/* <NewTrip isOpen={this.state.addTripIsOpen} onOpen={this.openAddTrip} onClose={this.closeAddTrip} /> */}
        <MyTrips />
      </div>
    )
  }
}

export default Trips
