import React from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import Rating from '../rating/Rating'
import SaveActivity from './SaveActivity'
import UnsaveActivity from './UnsaveActivity'
import UnplanActivity from './UnplanActivity'
import {storageKey} from '../../utils/firebase'
import './activityOverview.css'

const ActivityOverview = (props) => {
  return (
    <div>
      <div className='activityOverview'>
        <div className='activityTitle'>
          <div className='front'>
            {props.activity && props.activity.title ? props.activity.title : ''},&nbsp;
          {<Link to='/search' onClick={() => props.clickToSearch(props.activity.locality)}>{props.activity.locality}</Link> || ''},&nbsp;{<Link to='/search' onClick={() => props.clickToSearch(props.activity.country)}>{props.activity.country}</Link> || ''}
          </div>
          <div className='back'>
            {moment(props.activity.date).format('YYYY-MM-DD') || ''}
          </div>
        </div>
        {!props.areImagesHidden &&
        <div className='activityOthers'>
          <div className='activityImage'>
            <Link to={'/trips/' + props.activity.trip}>
              <img src={props.activity.image} alt={props.activity.title} />
            </Link>
          </div>
          <div className='activityDetails'>
            <div className='activityCaption'>
              {props.activity.caption || ''}
            </div>
            <div className='bottom'>
              <div className='activityRating'>
                <Rating stars={props.activity.rating} isEnabled={false} />
              </div>
              <div className='activityTags'>
                {props.activity.tags ? Object.keys(props.activity.tags).map((tag) => { return <Link key={tag} to='/search' onClick={() => props.clickToSearch(tag)}><i>#{tag + '  '}</i></Link> }) : []}
              </div>
            </div>
          </div>
        </div>
      }
        <div>
          {props.user !== window.localStorage[storageKey] &&
          <div className='activityTitle'>
            <Link to={'/users/' + props.user}><img src={props.image} alt={props.username} />{props.username || ''}</Link>
            {(props.type === 'trip' || props.type === 'home' || props.type === 'search') && window.localStorage[storageKey] &&
            <SaveActivity activityID={props.activityID} />
            }
            {(props.type === 'saved') && window.localStorage[storageKey] &&
            <UnsaveActivity activityID={props.activityID} />
            }
            {(props.type === 'planned') && window.localStorage[storageKey] &&
            <UnplanActivity activityID={props.activityID} plannedID={props.plannedID} />
            }
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ActivityOverview
