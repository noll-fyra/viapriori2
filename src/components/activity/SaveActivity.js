import React from 'react'
import {Link} from 'react-router-dom'
import db, {storageKey} from '../../utils/firebase'

const SaveActivity = (props) => {
  function saveActivity () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved').once('value').then((snap) => {
      let newObj = snap.val() || {}
      newObj[props.activityID] = true
      db.ref('users/' + window.localStorage[storageKey] + '/saved').set(newObj)
    })
  }
  return (

    <div>
        <button name={props.activityID} onClick={saveActivity}>Save Activity</button>
    </div>
  )
}

export default SaveActivity
