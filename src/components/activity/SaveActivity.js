import React from 'react'
import moment from 'moment'
import db, {storageKey} from '../../utils/firebase'
import updateDB, {updateDBPlusOne} from '../../utils/updateDB'

const SaveActivity = (props) => {
  function saveActivity () {
    updateDB('users/' + window.localStorage[storageKey] + '/saved', props.activityID, true)
    updateDBPlusOne('activities/' + props.activityID, 'saved')
    addSavedToAllAndTrending()
  }
  function addSavedToAllAndTrending () {
    db.ref('all/saved/' + props.activityID).once('value').then((snap) => {
      db.ref('all/saved/' + props.activityID).set(snap.val ? (snap.val() + 1) : 1)
    })
    db.ref('trending/saved/' + moment().format('dddd') + '/' + props.activityID).once('value').then((snap) => {
      db.ref('trending/saved/' + moment().format('dddd') + '/' + props.activityID).set(snap.val ? (snap.val() + 1) : 1)
    })
  }
  return (
    <div>
      <button name={props.activityID} onClick={saveActivity}>Save Activity</button>
    </div>
  )
}

export default SaveActivity
