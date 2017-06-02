import React from 'react'
import {Link} from 'react-router-dom'
import TripOverview from '../trip/TripOverview'
import UserOverview from '../profile/UserOverview'
import ActivityOverview from '../activity/ActivityOverview'
import SaveActivity from '../activity/SaveActivity'
import db, {storageKey} from '../../utils/firebase'
import {trendingObjectToArray} from '../../utils/format'

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.match.params.query || props.searchQuery,
      tripFiltered: [],
      activityFiltered: [],
      tripId: [],
      activityId: [],
      userId: [],
      userDetails: [],
      trending: []
    }
  }

  componentDidMount () {
    if (this.state.searchQuery) {
      let filteredTrips = []
      let tripKeys = []
      let activityKeys = []
      let userId = []
      let userDetails = []
      let filteredActivities = []

      db.ref('trending').on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            trending: trendingObjectToArray(snapshot.val())
          })
        }
      })

      db.ref('users').on('value', (snapshot) => {
        for (var user in snapshot.val()) {
          if (snapshot.val()[user].profile.username && snapshot.val()[user].profile.username.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
            userId.push(user)
          }
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
      })

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
        }
        let uniqueActivityKeys = activityKeys.filter((id, i) => {
          return activityKeys.indexOf(id) === i
        })
        uniqueActivityKeys.forEach((activity) => {
          filteredActivities.push(snapshot.val()[activity])
        })
        this.setState({
          activityId: uniqueActivityKeys,
          activityFiltered: filteredActivities
        })
      })

      db.ref('trips').on('value', (snapshot) => {
        for (var key in snapshot.val()) {
          let tripEnd = new Date(snapshot.val()[key].end)
          let tripStart = new Date(snapshot.val()[key].start)
          let tripDuration = (tripEnd - tripStart) / 86400000
          if (snapshot.val()[key].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
            tripKeys.push(key)
          } else if (tripDuration === parseInt(this.state.searchQuery, 10)) {
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
          tripFiltered: filteredTrips
        })
      })
    }
  }

  render () {
    let tripsSearched = this.state.tripFiltered.map((trip, index) => {
      return <TripOverview key={this.state.tripId[index]} tripID={this.state.tripId[index]} trip={trip} />
    })
    let activitySearched = this.state.activityFiltered.map((activity, index) => {
      return <div><ActivityOverview
        key={this.state.activityId[index]}
        activityID={this.state.activityId[index]}
        activity={activity}
        clickToSearch={this.props.clickToSearch}
      />
        {activity.user !== window.localStorage[storageKey] &&
        <div>
          <SaveActivity key={index} activityID={this.state.activityId[index]} activity={activity} />
          </div>

      }</div>
    })
    let userSearched = this.state.userDetails.map((user, index) => {
      return <UserOverview key={this.state.userId[index]} userID={this.state.userId[index]} user={user} />
    })

    return (
      <div>
        {!this.state.searchQuery &&

        <div className='nilquery'>
          <p>Please enter a search query...</p>
        </div>
      }
        {this.state.searchQuery && userSearched.length === 0 && tripsSearched.length === 0 && activitySearched.length === 0 &&
        <div className='nilqu'>
          <p>Sorry, no results found. How about seeing what's <Link to='/'>trending</Link>?</p>
        </div>
      }
{this.state.searchQuery && userSearched.length === 0 && tripsSearched.length === 0 && activitySearched.length === 0 &&
        <h3>Search Results</h3>
      }

        <div className='searchContainer'>
          {userSearched.length > 0 &&
          <div>
              <div>
                <h4 className='searchheading'>Users</h4>
                {userSearched}
              </div>
          </div>
        }
        {tripsSearched.length > 0 &&
          <div>
              <div>
                <h4 className='searchheading'>Trips</h4>
                {tripsSearched}
              </div>

          </div>
        }
        {activitySearched.length > 0 &&
          <div>
              <div>
                <h4 className='searchheading'>Activity</h4>
                {activitySearched}
              </div>

          </div>
        }

        </div>
      </div>
    )
  }
}

export default SearchResults
