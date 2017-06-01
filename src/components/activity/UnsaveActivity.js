import React from 'react'
import db, {storageKey} from '../../utils/firebase'

const UnsaveActivity = (props) => {
  function unsaveActivity () {
    console.log('unsaved');
    db.ref('users/' + window.localStorage[storageKey] + '/saved/' + props.activityID).remove()
    console.log(props.activityID);
  }
  return (
    <div>
      <button onClick={unsaveActivity}>Unsave</button>
    </div>
  )
}

export default UnsaveActivity
