import React from 'react'
// import * as firebase from 'firebase'

function Database (props) {
  return (
    <div>{JSON.stringify(props.database)}</div>
  )
}

export default Database
