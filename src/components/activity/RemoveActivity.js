import React from 'react'
import {Link} from 'react-router-dom'
import db, {storageKey} from '../../utils/firebase'

const RemoveActivity = (props) => {

  return (
    <div>
      <button onClick={() => props.removeActivity(props.activityID)}>Remove</button>
    </div>
)
}

export default RemoveActivity
