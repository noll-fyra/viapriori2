import React from 'react'
import TripOverview from '../trip/TripOverview'
import ActivityOverview from '../activity/ActivityOverview'

import db from '../../utils/firebase'

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.searchQuery,
      tripFiltered: [],
      activityFiltered: [],
      tripId: [],
      activityId: []
    }
  }

  componentDidMount () {
    let filteredTrips = []
    let tripKeys = []
    let activityKeys = []

    db.ref('activities').on('value', (snapshot) => {
      for (var activityId in snapshot.val()) {
        if (snapshot.val()[activityId].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
          activityKeys.push(activityId)
          tripKeys.push(snapshot.val()[activityId].trip)
        } else if (snapshot.val()[activityId].locality.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
          activityKeys.push(activityId)
          tripKeys.push(snapshot.val()[activityId].trip)
        } else if (snapshot.val()[activityId].country.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
          activityKeys.push(activityId)
          tripKeys.push(snapshot.val()[activityId].trip)
        } else if (snapshot.val()[activityId].tags) {
          for (var tags in snapshot.val()[activityId].tags) {
            if (tags.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
              activityKeys.push(activityId)
              tripKeys.push(snapshot.val()[activityId].trip)
            }
          }
        }
          let uniqueActivityKeys = activityKeys.filter((id, i) => {
            return activityKeys.indexOf(id) === i
          })
          let filteredActivities = []
          uniqueActivityKeys.forEach((activity) => {
            filteredActivities.push(snapshot.val()[activity])
          })
          this.setState({
            activityId: uniqueActivityKeys,
            activityFiltered: filteredActivities,
          })
        // console.log(arr)
      }
      db.ref('trips').on('value', (snapshot) => {
        for (var key in snapshot.val()) {
          let tripEnd = new Date(snapshot.val()[key].end)
          let tripStart = new Date(snapshot.val()[key].start)
          let tripDuration = (tripEnd - tripStart) / 86400000
          if (snapshot.val()[key].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
            tripKeys.push(key)
          } else if (tripDuration === parseInt(this.state.searchQuery)) {
            tripKeys.push(key)
          }
        }
        let uniqueTripKeys = tripKeys.filter((id, i) => {
          return tripKeys.indexOf(id) === i
        })
        uniqueTripKeys.forEach((trip) => {
          filteredTrips.push(snapshot.val()[trip])
        })

        this.setState({
          tripId: uniqueTripKeys,
          tripFiltered: filteredTrips,
        })
      })
    })
  }

  render () {

    let tripsSearched = this.state.tripFiltered.map((trip, index) => {
      return <TripOverview key={this.state.tripId[index]} tripID={this.state.tripId[index]} trip={trip} />
    })
    let activitySearched = this.state.activityFiltered.map((activity, index) => {
      return <ActivityOverview key={this.state.activityId[index]} activityID={this.state.activityId[index]} activity={activity} />
    })
    console.log(this.state.activityFiltered)
    console.log(this.state.activityId)
    return (
      <div>
        <h1>Search Results</h1>
        <h2>Trips</h2>
        {tripsSearched}
        <div>
        <h2>Activity</h2>
        {activitySearched}
          {/* <Link to={'trips/' + props.trip.title + '/' + props.tripID}>
            <div className='tripOverview'><p>{props.trip.title || ''} <span>Ratings:{averageRating()}</span></p><img src={props.trip.image} alt={props.trip.title} /></div>
          </Link> */}
        </div>
      </div>
    )
  }
}

export default SearchResults
