import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import db from './firebaseThing'

db.ref().on('value', snapshot => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
})
