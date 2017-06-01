import React from 'react'
import {storageKey} from '../../utils/firebase'
import updateDB, {updateDBPlusOne} from '../../utils/updateDB'

const SaveActivity = (props) => {
  function saveActivity () {
    updateDB('users/' + window.localStorage[storageKey] + '/saved', props.activityID, true)
    updateDBPlusOne('activities/' + props.activityID, 'saved')
  }
  return (
    <div>
      <button name={props.activityID} onClick={saveActivity}>Save Activity</button>
    </div>
  )
}

export default SaveActivity
