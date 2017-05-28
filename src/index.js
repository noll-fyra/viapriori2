import React from 'react'
import ReactDOM from 'react-dom'
import schedule from 'node-schedule'
import moment from 'moment'
import App from './components/app/App'
import './index.css'
import db from './utils/firebase'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

// remove last week's trending tags at midnight everyday
var rule = new schedule.RecurrenceRule()
rule.hour = 0
var deleteLastWeeksTrending = schedule.scheduleJob(rule, () => {
  db.ref('trending').once('value').then((snap) => {
    let keys = Object.keys(snap.val())
    keys.forEach((key) => {
      db.ref('trending/' + key + '/' + moment().format('dddd')).remove()
    })
  })
})

console.log(deleteLastWeeksTrending)
