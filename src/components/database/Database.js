import React from 'react'

function Database (props) {
  return (
    <div>{JSON.stringify(props.database)}</div>
  )
}

export default Database
