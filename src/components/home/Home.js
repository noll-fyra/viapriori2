import React from 'react'
import TripOverview from '../trip/TripOverview'
import db from '../../utils/firebase'
import {allObjectToArray} from '../../utils/format'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: [],
      trips: [],
      all: [],
      trending: []
    }
  }

  componentDidMount () {
    // fetch all trips
    db.ref('trips').on('value', snapshot => {
      const keys = []
      const trips = []
      for (var key in snapshot.val()) {
        keys.push(key)
        trips.push(snapshot.val()[key])
        this.setState({
          keys: keys,
          trips: trips
        })
      }
    })

    // fetch all and trending
    db.ref('all').on('value', snapshot => {
      this.setState({
        all: allObjectToArray(snapshot.val())
      })
    })
    // db.ref('trending').on('value', snapshot => {
    //   this.setState({
    //     trending: tagsObjectToArray(snapshot.val())
    //   })
    // })
  }

  render () {
    const reverseTrips = this.state.trips.slice().reverse().map((trip, index) => {
      return <TripOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} />
    })
    // const allList = this.state.all.slice(0, 10).map((tag) => {
    //   return <li key={tag}>{tag}</li>
    // })
    return (
      <div>
        <b>Trending</b>
        <ul>
          {JSON.stringify(this.state.tags)}
        </ul>
        <div className='trips'>
          {reverseTrips}
        </div>
      </div>
    )
  }
}

export default Home
