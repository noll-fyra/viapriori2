import React from 'react'
import TripOverview from '../trip/TripOverview'
import db from '../../utils/firebase'

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: props.searchQuery,
      tripFiltered: [],
      activityFiltered:[],
      tripId:[],
      activityId: []
    }
  }

  componentDidMount () {
    let filteredTrips = []
    let filteredActivities = []
    let tripKeys = []
    db.ref('activities').on('value', (snapshot) => {
      // console.log(snapshot.val())
      for (var activityId in snapshot.val()) {
        if (snapshot.val()[activityId].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())){
          filteredActivities.push(snapshot.val()[activityId])
          tripKeys.push(snapshot.val()[activityId].trip)
        }
        else if (snapshot.val()[activityId].locality.toLowerCase().includes(this.state.searchQuery.toLowerCase())){
          filteredActivities.push(snapshot.val()[activityId])
          tripKeys.push(snapshot.val()[activityId].trip)
        }
        else if (snapshot.val()[activityId].country.toLowerCase().includes(this.state.searchQuery.toLowerCase())){
          filteredActivities.push(snapshot.val()[activityId])
          tripKeys.push(snapshot.val()[activityId].trip)
        }
        else if (snapshot.val()[activityId].tags) {
          for (var tags in snapshot.val()[activityId].tags){
            if (tags.toLowerCase().includes(this.state.searchQuery.toLowerCase())){
              filteredActivities.push(snapshot.val()[activityId])
              tripKeys.push(snapshot.val()[activityId].trip)
            }
          }
        }
      }
    db.ref('trips').on('value', (snapshot) => {
      // console.log(snapshot.val())
      tripKeys.forEach((trip)=>{
        filteredTrips.push(snapshot.val()[trip])
        console.log(tripKeys.length)
      })
      for (var key in snapshot.val()) {
        let tripEnd = new Date(snapshot.val()[key].end)
        let tripStart = new Date(snapshot.val()[key].start)
        let tripDuration = (tripEnd - tripStart) / 86400000
        if (snapshot.val()[key].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())){
          filteredTrips.push(snapshot.val()[key])
          tripKeys.push(key)
              console.log(tripKeys.length)
        }
        else if (tripDuration === parseInt(this.state.searchQuery)){
          filteredTrips.push(snapshot.val()[key])
          tripKeys.push(key)
              console.log(tripKeys.length)
        }
      }
    })
    })
      console.log(filteredTrips)
      console.log(filteredActivities)

    this.setState({
      tripId: tripKeys,
      tripFiltered: filteredTrips,
      activityFiltered: filteredActivities
    })
  }

  render () {
    console.log(this.state.tripFiltered)
    console.log(this.state.tripId)
    console.log(this.state.activityFiltered)
    let tripsSearched = this.state.tripFiltered.map((trip, index) => {
      return <TripOverview key={this.state.tripId[index]} tripID={this.state.tripId[index]} trip={trip} />
    })
    // const tagList = this.state.tags.slice(0, 10).map((tag) => {
    //   return <li key={tag}>{tag}</li>
    // })

    return (
      <div>
        <h1>Search Results</h1>
        {tripsSearched}
        <div>
          {/* <Link to={'trips/' + props.trip.title + '/' + props.tripID}>
            <div className='tripOverview'><p>{props.trip.title || ''} <span>Ratings:{averageRating()}</span></p><img src={props.trip.image} alt={props.trip.title} /></div>
          </Link> */}
        </div>
      </div>
    )
  }
}

export default SearchResults
