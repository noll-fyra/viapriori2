import React from 'react'
import ActivityOverview from '../activity/ActivityOverview'
import Planned from '../planned/Planned'
import SearchForm from '../search/SearchForm'
import PlanActivity from '../activity/PlanActivity'
import db, {storageKey} from '../../utils/firebase'
import search from '../../utils/search'
import updateDB from '../../utils/updateDB'
import './saved.css'

class Saved extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: '',
      savedKeys: [],
      savedActivities: [],
      plannedTrips: [],
      plannedKeys: [],
      users: {}
    }
    this.createNewPlanned = this.createNewPlanned.bind(this)
    this.search = search.bind(this)
  }

  componentDidMount () {
    // get all users
    db.ref('users').once('value').then(snap => {
      let users = snap.val() || {}
      this.setState({
        users: users
      })
    })

    db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
      if (snapshot.val() && snapshot.val().saved) {
        // saved activity keys
        let savedKeys = Object.keys(snapshot.val().saved)
        this.setState({
          savedKeys: savedKeys
        })
        // saved activity details
        let savedActivities = new Array(savedKeys.length).fill(null)
        for (var activity in snapshot.val().saved) {
          let ind = savedKeys.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            savedActivities[ind] = snap.val()
            this.setState({
              savedActivities: savedActivities
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

  componentDidUpdate (prevProps, prevState) {
    if (this.state.searchQuery !== prevState.searchQuery) {
      let activityKeys = []
      let activityDetails = []
      let tripKeys = []
      let tripDetails = []

      // get all users
      db.ref('users').once('value').then(snap => {
        let users = snap.val() || {}
        this.setState({
          users: users
        })
      })

      db.ref('users/' + window.localStorage[storageKey]).on('value', snapshot => {
        if (snapshot.val() && snapshot.val().saved) {
        // saved activity keys
          let savedKeys = Object.keys(snapshot.val().saved)
          this.setState({
            savedKeys: savedKeys
          })
        // saved activity details
          for (var activity in snapshot.val().saved) {
            let index = savedKeys.indexOf(activity)

            db.ref('activities/' + activity).on('value', snap => {
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
              this.setState({
                savedActivities: activityDetails,
                activityKeys: activityKeys
              })
            })
          }
        } else {
          this.setState({
            savedKeys: [],
            activityKeys: [],
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
          for (var trip in snapshot.val().planned) {
            let ind = plannedKeys.indexOf(trip)
            db.ref('planned/' + trip).on('value', snap => {
              let tripEnd = new Date(snap.val().end)
              let tripStart = new Date(snap.val().start)
              let tripDuration = (tripEnd - tripStart) / 86400000
              if (snap.val().title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                tripKeys.push(plannedKeys[ind])
                tripDetails.push(snap.val())
              } else if (tripDuration === parseInt(this.state.searchQuery, 10)) {
                tripKeys.push(plannedKeys[ind])
                tripDetails.push(snap.val())
              }
            })
          }
          this.setState({
            plannedTrips: tripDetails,
            tripKeys: tripKeys
          })
        } else {
          this.setState({
            plannedTrips: [],
            tripKeys: [],
            plannedKeys: []
          })
        }
      })
    }
  }

  createNewPlanned (title) {
    let newRef = db.ref('planned').push()
    let newPlannedTripID = newRef.key
    newRef.set({
      user: window.localStorage[storageKey],
      title: title
    })
    updateDB('users/' + window.localStorage[storageKey] + '/planned', newPlannedTripID, true)
    return newRef.key
  }

  render () {
    let reverseSaved = this.state.savedActivities.slice().reverse()
    let reverseKeys = this.state.savedKeys.slice().reverse()
    let options = this.state.plannedTrips.map((trip, index) => {
      return <option key={this.state.plannedKeys[index]}>{trip.title || ''}</option>
    })
    return (
      <div>
        <div className='savedContainer'>
          <div>
            <Planned plannedKeys={this.state.plannedKeys}
              plannedTrips={this.state.plannedTrips} />
          </div>
          <div className='saved'>
            <SearchForm placeholder='Search your saved activities and planned trips' onChange={this.search} />
            <h3 className='savedHeading'> Saved Activities</h3>
            {this.state.savedActivities &&
          reverseSaved.map((activity, index) => {
            return (<div key={reverseKeys[index]}>
              <ActivityOverview
                activity={activity}
                activityID={reverseKeys[index]}
                clickToSearch={this.props.clickToSearch}
                user={activity.user}
                username={this.state.users[activity.user] && (this.state.users[activity.user]).profile ? (this.state.users[activity.user]).profile.username : ''}
                image={this.state.users[activity.user] && (this.state.users[activity.user]).profile ? (this.state.users[activity.user]).profile.profileImage : ''}
                areImagesHidden={false}
                type='saved'
             />
              <PlanActivity activityID={reverseKeys[index]} plannedKeys={this.state.plannedKeys} createNewPlanned={this.createNewPlanned} options={options} />
            </div>
            )
          })
        }
          </div>
          <div />
        </div>

      </div>
    )
  }
}

export default Saved
