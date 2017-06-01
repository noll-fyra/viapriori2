import React from 'react'

const RemoveActivity = (props) => {
  return (
    <div>
      <button onClick={() => props.removeActivity(props.activityID)}>Remove</button>
    </div>
  )
}

export default RemoveActivity
