import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'


const trips = [
  'Vietnam',
  'Taiwan',
  'Japan'
]
const planned = [
  'Planned1',
  'Planned2',
  'Planned3'
]
const favorites = [
  'Favorites1',
  'Favorites2',
  'Favorites3'
]
const profile = [
  'Name',
  'email',
  'age',
]

  ReactDOM.render(
    <App trips = {trips} profile = {profile} planned = {planned} favorites = {favorites}/>,
    document.getElementById('root')
  )
