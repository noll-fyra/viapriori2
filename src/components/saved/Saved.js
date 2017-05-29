import React from 'react'
import db, {storageKey} from '../../utils/firebase'
import SavedOverview from './SavedOverview'
import Planned from '../planned/Planned'
import search from '../../utils/search'
import SearchForm from '../search/SearchForm'

class Saved extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: '',
      savedKeys: [],
      savedActivities: [],
      plannedTrips: [],
      plannedKeys: []
    }
    this.createNewPlanned = this.createNewPlanned.bind(this)
    this.search = search.bind(this)
  }

  componentDidMount () {

    console.log('search')
    // if (this.state.searchQuery === !this.props.searchQuery){
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
          let index = savedKeys.indexOf(activity)
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
      // check if there are any planned trips
      if (snapshot.val() && snapshot.val().planned) {
        // planned trip keys
        let plannedKeys = Object.keys(snapshot.val().planned)
        this.setState({
          plannedKeys: plannedKeys
        })
        // planned trip details
        let plannedTrips = new Array(plannedKeys.length).fill(null)
        for (var trip in snapshot.val().planned) {
          let ind = plannedKeys.indexOf(trip)
          db.ref('planned/' + trip).on('value', snap => {
            plannedTrips[ind] = snap.val()
            this.setState({
              plannedTrips: plannedTrips
            })
          })
        }
      } else {
        this.setState({
          plannedTrips: [],
          plannedKeys: []
        })
      }
    })
  }
// }

  createNewPlanned (title) {
    let newRef = db.ref('planned').push()
    let newPlannedTripID = newRef.key
    newRef.set({
      user: window.localStorage[storageKey],
      title: title
    })
    db.ref('users/' + window.localStorage[storageKey] + '/planned').once('value', snap => {
      let newObj = snap.val() || {}
      newObj[newPlannedTripID] = true
      db.ref('users/' + window.localStorage[storageKey] + '/planned').set(newObj)
    })
    return newRef.key
  }


  render () {
    console.log(this.state.searchQuery)
    console.log(this.state.activityKeys)
      console.log(this.state.savedActivities)
    let reverseSaved = this.state.savedActivities.slice().reverse()
    let reverseKeys = this.state.savedKeys.slice().reverse()
    let options = this.state.plannedTrips.map((trip, index) => {
      return <option key={this.state.plannedKeys[index]}>{trip.title || ''}</option>
    })

    return (
      <div>
        <SearchForm placeholder='Search saved activities and planned trips' onChange={this.search}/>
        {/* <SearchForm placeholder='Search' onChange={this.search} onKeyUp={(e) => this.handleSearch(e)} /> */}
        {/* <Link to='/saved/search' className='searchButton' ref={this.props.linkToSearch} style={{display: 'none'}} /> */}

        <Planned plannedKeys={this.state.plannedKeys}
          plannedTrips={this.state.plannedTrips} />
        <h1> Saved Activities</h1>

        {this.state.savedActivities &&
          reverseSaved.map((activity, index) => {
            return <SavedOverview
              key={reverseKeys[index]}
              activityID={reverseKeys[index]}
              activity={activity}
              options={options}
              plannedKeys={this.state.plannedKeys}
              plannedTrips={this.state.plannedTrips}
              createNewPlanned={this.createNewPlanned}
            />
          })
        }
      </div>
    )
  }
}

export default Saved
