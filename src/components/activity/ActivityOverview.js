import React from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import Rating from '../rating/Rating'
import db, {storageKey} from '../../utils/firebase'
import {tagsObjectToArray} from '../../utils/format'

const ActivityOverview = (props) => {
  function saveActivity () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[props.activityID] = true
      db.ref('users/' + window.localStorage[storageKey] + '/saved').set(newObj)
    })
  }

  return (
    <div>
      <div className='activityOverview'><p>Activity: {props.activity.title || ''}</p>
        <img src={props.activity.image} alt={props.activity.title} />
        <p>Date: {moment(props.activity.date).format('YYYY-MM-DD') || ''}</p>
        <p>City:{props.activity.locality || ''}</p>
        <p>Country: {props.activity.country || ''}</p>
        <p>Caption:{props.activity.caption || ''}</p>
        <p>Tags:{props.activity.tags ? tagsObjectToArray(props.activity.tags) : ''}</p>
        <Rating stars={props.activity.rating} isEnabled={false} />
        <button name={props.activityID} onClick={saveActivity}>Save Activity</button>
        <Link to={'/trips/' + props.activity.trip}>View Trip</Link>
      </div>
    </div>
  )
}

export default ActivityOverview
