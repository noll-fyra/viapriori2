import React from 'react'
import db from '../../utils/firebase'

const UnplanActivity = (props) => {
  function unplanActivity () {
    db.ref('planned/' + props.plannedID + '/activities/' + props.activityID).remove()
  }
  return (
    <div>
      <button onClick={unplanActivity}>Unplan</button>
    </div>
  )
}

export default UnplanActivity
