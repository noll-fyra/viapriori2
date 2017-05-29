import React from 'react'
import TripOverview from '../trip/TripOverview'
import ActivityOverview from '../activity/ActivityOverview'

import db from '../../utils/firebase'

class SavedSearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.searchQuery,
      tripFiltered: [],
      activityFiltered: [],
      tripId: [],
      activityId: [],
      savedKeys: [],
      savedActivities: [],
      plannedTrips: [],
      plannedKeys: []
    }
  }


  componentDidMount () {
    let filteredTrips = []
    let tripKeys = []
    let activityKeys = []
    let activityDetails = []

    db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
      if (snapshot.val() && snapshot.val().saved) {
        // saved activity keys

        let savedKeys = Object.keys(snapshot.val().saved)
        this.setState({
          savedKeys: savedKeys
        })
        // saved activity details
        // let savedActivities = new Array(savedKeys.length).fill(null)
        for (var activity in snapshot.val().saved) {
          let ind = savedKeys.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            // savedActivities[ind] = snap.val()
            if (snap.val().title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
              activityKeys.push(savedKeys[index])
              activityDetails.push(snap.val())
            } else if (snap.val().locality.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
              activityKeys.push(savedKeys[index])
              activityDetails.push(snap.val())
            } else if (snap.val().country.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
              activityKeys.push(savedKeys[index])
              activityDetails.push(snap.val())
            } else if (snap.val().tags) {
              for (var tags in snap.val().tags) {
                if (tags.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                  activityKeys.push(savedKeys[index])
                  activityDetails.push(snap.val())

                }
              }
            }
            console.log(activityDetails)
            console.log(activityKeys)
            this.setState({
              savedActivities: activityDetails,
              activityKeys: activityKeys
            })
          })
        }
      } else {
        this.setState({
          savedKeys: [],
          savedActivities: []
        })
      }



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
          activityFiltered: filteredActivities
        })
      }
    })
    db.ref('trips').on('value', (snapshot) => {
      for (var key in snapshot.val()) {
        let tripEnd = new Date(snapshot.val()[key].end)
        let tripStart = new Date(snapshot.val()[key].start)
        let tripDuration = (tripEnd - tripStart) / 86400000
        if (snapshot.val()[key].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
          tripKeys.push(key)
        } else if (tripDuration === parseInt(this.state.searchQuery,10)) {
          tripKeys.push(key)
        }
        let uniqueTripKeys = tripKeys.filter((id, i) => {
          return tripKeys.indexOf(id) === i
        })
        uniqueTripKeys.forEach((trip) => {
          filteredTrips.push(snapshot.val()[trip])
        })
        this.setState({
          tripId: uniqueTripKeys,
          tripFiltered: filteredTrips
        })
      }
    })
    db.ref('users').on('value', (snapshot) => {
      for (var key in snapshot.val()) {
        if (this.state.searchQuery && snapshot.val()[key].details.username.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
          userId.push(key)
        }
        let uniqueUsers = userId.filter((id, i) => {
          return userId.indexOf(id) === i
        })
        uniqueUsers.forEach((user) => {
          userDetails.push(snapshot.val()[user])
        })
        this.setState({
          userId: uniqueUsers,
          userDetails: userDetails
        })
      }
    })
  }

  render () {
    let tripsSearched = this.state.tripFiltered.map((trip, index) => {
      return <TripOverview key={this.state.tripId[index]} tripID={this.state.tripId[index]} trip={trip} />
    })
    let activitySearched = this.state.activityFiltered.map((activity, index) => {
      return <ActivityOverview key={this.state.activityId[index]} activityID={this.state.activityId[index]} activity={activity} />
    })

    return (
      <div>
        <h1>Search Results</h1>

        {tripsSearched.length > 0 &&
          <div>
            <h2>Trips</h2>
          {tripsSearched}
        </div>
        }

        {activitySearched.length > 0 &&
          <div>
            <h2>Activity</h2>
          {activitySearched}
        </div>
        }

        {tripsSearched.length === 0 && activitySearched.length === 0 &&
          <div>
            <p>Sorry, no results found</p>
          </div>
        }

      </div>
    )
  }
}

export default SavedSearchResults
