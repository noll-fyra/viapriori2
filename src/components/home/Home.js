import React from 'react'
import TripOverview from '../trip/TripOverview'
import db from '../../utils/firebase'
import {tagsObjectToArray} from '../../utils/format'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: [],
      trips: [],
      tags: []
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

    // fetch all tags
    db.ref('tags').on('value', snapshot => {
      this.setState({
        tags: tagsObjectToArray(snapshot.val())
      })
    })
  }

  render () {
    const reverseTrips = this.state.trips.slice().reverse().map((trip, index) => {
      return <TripOverview key={this.state.keys[index]} tripID={this.state.keys[index]} trip={trip} />
    })
    const tagList = this.state.tags.slice(0, 10).map((tag) => {
      return <li key={tag}>{tag}</li>
    })
    return (
      <div>
        <b>Trending</b>
        <ul>
          {tagList}
        </ul>
        <div className='trips'>
          {reverseTrips}
        </div>
      </div>
    )
  }
}

export default Home
