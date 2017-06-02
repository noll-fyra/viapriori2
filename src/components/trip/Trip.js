import React from 'react'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import ActivityOverview from '../activity/ActivityOverview'
import db, {storageKey} from '../../utils/firebase'
import './trip.css'

const DragHandle = SortableHandle(() => <div className='dragHandle'>||||</div>) // This can be any component you want

const SortableItem = SortableElement(({value, id, clickToSearch, user, username, image, areImagesHidden, type}) => {
  return (
    <li className='sortable'>
      {window.localStorage[storageKey] && window.localStorage[storageKey] === user &&
      <DragHandle />
      }
      <ActivityOverview
        activityID={id}
        activity={value}
        clickToSearch={clickToSearch}
        user={user}
        username={username}
        image={image}
        areImagesHidden={areImagesHidden}
        type={type}
      />
    </li>
  )
})

const SortableList = SortableContainer(({activities, id, clickToSearch, user, username, image, areImagesHidden, type}) => {
  return (
    <ul>
      {activities.map((value, index) => (
        <SortableItem key={`item-${index}`}
          index={index}
          value={value}
          id={id[index]}
          clickToSearch={clickToSearch}
          user={user}
          username={username}
          image={image}
          areImagesHidden={areImagesHidden}
          type={type}
        />
      ))}
    </ul>
  )
})

class Trip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activities: [],
      keys: [],
      details: {},
      currentTrip: props.currentTrip || props.match.params.id,
      username: '',
      userImage: '',
      hideImages: false
    }
    this.updateTrip = this.updateTrip.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.hideImages = this.hideImages.bind(this)
  }

  componentDidMount () {
    this.updateTrip()
  }

  componentWillReceiveProps (nextProps) {
    this.updateTrip()
  }

  updateTrip () {
    this.setState({
      currentTrip: this.props.currentTrip || this.props.match.params.id
    })
    db.ref('trips/' + this.state.currentTrip).on('value', snapshot => {
      if (snapshot.val()) {
        let tripDetails = snapshot.val() || {}
        let tempKeys = []
        for (var key in tripDetails.activities) {
          tempKeys.push([key, tripDetails.activities[key]])
        }
        let keys = tempKeys.sort((a, b) => { return a[1] - b[1] }).map((key) => { return key[0] })
        this.setState({
          keys: keys,
          details: tripDetails
        })

        let temp = keys.slice()
        for (var activity in snapshot.val().activities) {
          let ind = keys.indexOf(activity)
          db.ref('activities/' + activity).once('value').then((snap) => {
            temp[ind] = snap.val()
            this.setState({
              activities: temp
            })
          })
        }

        db.ref('users/' + tripDetails.user).once('value').then((snapshot) => {
          let user = snapshot.val() || {}
          this.setState({
            username: user.profile && user.profile.username ? user.profile.username : '',
            userImage: user.profile && user.profile.profileImage ? user.profile.profileImage : ''
          })
          console.log(this.state.userImage)
        })
      }
    })
  }

  onSortEnd ({oldIndex, newIndex}) {
    let activities = this.state.activities
    let keys = this.state.keys
    this.setState({
      activities: arrayMove(activities, oldIndex, newIndex),
      keys: arrayMove(keys, oldIndex, newIndex)
    })
    db.ref('trips/' + this.state.currentTrip + '/activities').once('value').then((snap) => {
      let newObj = snap.val() || {}
      this.state.keys.forEach((key, index) => {
        newObj[key] = index
      })
      db.ref('trips/' + this.state.currentTrip + '/activities').set(newObj)
    })
  }

  hideImages () {
    this.setState({
      hideImages: !this.state.hideImages
    })
  }

  render () {
    return (
      <div>
        <div className='tripsContainer'>
          <div className='hideButtonContainer'>
            {window.localStorage[storageKey] && window.localStorage[storageKey] === this.state.details.user &&
            <button className='hideButton' onClick={this.hideImages}>{this.state.hideImages ? 'Show images' : 'Hide images'}</button>
            }
          </div>
          <div>
            <h3>{this.state.details.title || ''}</h3>
            <SortableList
              activities={this.state.activities}
              onSortEnd={this.onSortEnd}
              useDragHandle
              lockAxis='y'
              id={this.state.keys}
              clickToSearch={this.props.clickToSearch}
              user={this.state.details.user}
              username={this.state.username}
              image={this.state.userImage}
              areImagesHidden={this.state.hideImages}
              type='trip'
            />
          </div>
          <div />
        </div>
      </div>
    )
  }
}

export default Trip
