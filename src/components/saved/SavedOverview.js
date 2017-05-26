import React from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import Rating from '../rating/Rating'

const SavedOverview = (props) => {

  return (
    <div>
      <div className='activityOverview'><p>Activity: {props.activity.title||''}</p><img src={props.activity.image} alt={props.activity.title}/>
        <p>Date: {moment(props.activity.date).format('YYYY-MM-DD')|| ''}</p><p>City:{props.activity.city||''}</p><p>Country: {props.activity.country||''}</p><p>Caption:{props.activity.caption||''}</p><Rating stars={props.activity.rating} isEnabled={true}/>

      

        {!props.isPlannedTrip && this.state.trips.length > 0 &&
        <p>
          <label>
            Add to:
            <select onChange={this.chooseTrip}>
              {options}
            </select>
          </label>
           or <button onClick={() => this.startNewPlanned(true)}>Plan a trip</button>
        </p>
        }
        {props.isPlannedTrip && this.state.trips.length > 0 &&
          <p><input type='text' name={props.activityID} onChange={props.handlePlannedActivity} placeholder='Add new trip' />
        or <button name={props.activityID} onClick={() => this.startNewPlanned(false)}>Add to existing plans</button></p>
        }

        <button name={props.activityID} onClick={props.handleRemoveSaved}>Remove</button>

      </div>

    </div>
  )
}

export default SavedOverview
