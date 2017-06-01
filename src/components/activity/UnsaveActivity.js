import React from 'react'
import db, {storageKey} from '../../utils/firebase'

const UnsaveActivity = (props) => {
  function unsaveActivity () {
    db.ref('users/' + window.localStorage[storageKey] + '/saved/' + props.activityID).remove()
  }
  return (
    <div>
      <button onClick={unsaveActivity}>Unsave</button>
    </div>
  )
}

export default UnsaveActivity
