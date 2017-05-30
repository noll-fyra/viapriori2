import React from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import Rating from '../rating/Rating'

const ActivityOverview = (props) => {
  return (
    <div>
      <div className='activityOverview'><p>Activity: {props.activity.title || ''}</p>
        <img src={props.activity.image} alt={props.activity.title} />
        <p>{<Link to='/search' onClick={() => props.clickToSearch(props.activity.locality)}>{props.activity.locality}</Link> || ''}, {<Link to='/search' onClick={() => props.clickToSearch(props.activity.country)}>{props.activity.country}</Link> || ''}</p>
        <p>Date: {moment(props.activity.date).format('YYYY-MM-DD') || ''}</p>
        <p>Caption: {props.activity.caption || ''}</p>
        <p>{props.activity.tags ? Object.keys(props.activity.tags).map((tag) => { return <Link key={tag} to='/search' onClick={() => props.clickToSearch(tag)}><i>#{tag + '  '}</i></Link> }) : []}</p>
        <Rating stars={props.activity.rating} isEnabled={false} />

      </div>
    </div>
  )
}

export default ActivityOverview
