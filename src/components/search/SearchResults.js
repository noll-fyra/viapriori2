import React from 'react'
import {Link} from 'react-router-dom'
import TripOverview from '../trip/TripOverview'
import Details from '../profile/Details'
import ActivityOverview from '../activity/ActivityOverview'
import db from '../../utils/firebase'

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.searchQuery,
      tripFiltered: [],
      tripId: [],
      activityId: [],
      users: [],
      activities: []
    }
  }

  componentDidMount () {
    let filteredTrips = []
    let tripKeys = []

    db.ref('users').on('value', (snapshot) => {
      let users = []
      for (var key in snapshot.val()) {
        users.push([key, snapshot.val()[key]])
        this.setState({
          users: users
        })
      }
    })

    db.ref('activities').on('value', (snapshot) => {
      let activities = []
      for (var key in snapshot.val()) {
        activities.push([key, snapshot.val()[key]])
        this.setState({
          activities: activities
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

  render () {
    let tripsSearched = this.state.tripFiltered.map((trip, index) => {
      return <TripOverview key={this.state.tripId[index]} tripID={this.state.tripId[index]} trip={trip} />
    })

    let activitySearched = this.state.activities.map((item) => { return [item[0], item[1], (item[1].tags ? Object.keys(item[1].tags) : [])] })
    let tags = activitySearched.map((item) => { return item[2].length > 0 ? item[2].map((thing) => { return thing.toLowerCase() }) : [] })
    .map((tag) => { return tag.length > 0 ? tag.reduce((a, b) => { return a + ',' + b }) : '' })
    let final = activitySearched.filter((activity, index) => {
      return activity[1].title.toLowerCase().includes(this.props.searchQuery) ||
      activity[1].locality.toLowerCase().includes(this.props.searchQuery) ||
      activity[1].country.toLowerCase().includes(this.props.searchQuery) ||
      tags[index].includes(this.props.searchQuery)
    }).map((activity, index) => {
      return <ActivityOverview
        key={activity[0]}
        activityID={activity[0]}
        activity={activity[1]}
        clickToSearch={this.props.clickToSearch}
        user={activity[1].user}
        username={this.state.users[activity[1].user] && (this.state.users[activity[1].user]).profile ? (this.state.users[activity[1].user]).profile.username : ''}
        image={this.state.users[activity[1].user] && (this.state.users[activity[1].user]).profile ? (this.state.users[activity[1].user]).profile.profileImage : ''}
        areImagesHidden={false}
        type='search'
      />
    })

    let userSearched = this.state.users.filter((user) => {
      return user[1].profile.username.toLowerCase().includes(this.props.searchQuery)
    })
      .map((user, index) => {
        return <Details
          key={user[0]}
          currentUser={this.props.currentUser}
          userID={user[0]}
          user={user[1]}
          type='search'
      />
      })
      let searchResults = false
      if (userSearched.length || final.length||tripsSearched.length){
        searchResults=true
      }
    return (
      <div>
{this.state.searchQuery && searchResults &&
        <div className='searchContainer'>
          {userSearched.length > 0 &&
          <div className='searchUserSection'>

            <div>
              <h4 className='searchheading'>Users</h4>
              {userSearched}
            </div>
          </div>
        }
          {final.length > 0 &&
          <div className='searchActivitySection'>
            <div>
              <h4 className='searchheading'>Activity</h4>
              {final}
            </div>

          </div>
        }
          {tripsSearched.length > 0 &&
          <div className='searchTripSection'>
            <div>
              <h4 className='searchheading'>Trips</h4>
              {tripsSearched}
            </div>
          </div>
        }

        </div>
      }
      {!this.state.searchQuery &&
        <div className='nilquery'>
          <p>Please enter a search query...</p>
        </div>
      }
      {this.state.searchQuery && !searchResults &&
        <div className='nilquery'>
          <p>Sorry, no results found. How about seeing what's <Link to='/'>trending</Link>?</p>
        </div>
      }
      </div>
    )
  }
}

export default SearchResults
