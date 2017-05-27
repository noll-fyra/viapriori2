import React from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import Rating from '../rating/Rating'

const SavedOverview = (props) => {

  return (
    <div>
      <div className='activityOverview'><p>Activity: {props.activity.title||''}</p><img src={props.activity.image} alt={props.activity.title}/>
        <p>Date: {moment(props.activity.date).format('YYYY-MM-DD')|| ''}</p><p>City:{props.activity.city||''}</p><p>Country: {props.activity.country||''}</p><p>Caption:{props.activity.caption||''}</p><Rating stars={props.activity.rating} isEnabled={true}/>

        {props.trips.length === 0 &&
            <form onSubmit={props.createNewPlanned} name={props.activityID}>
              <input id='newPlanned' type='text' placeholder='Add title for your first planned trip!'/>
              <input type='submit' value="Create Planned Trip" />
            </form>
        }

        {!props.isPlanned && props.trips.length > 0 &&
        <div>
          <form onSubmit={props.createNewPlanned} name={props.activityID}>
          <label>
            Add to:
            <select onChange={props.chooseTrip}>
              {props.options}
            </select>
          </label>
            <input type='submit' value="Add activity" />
          </form>
           or <button onClick={props.startNewPlanned}>Plan a new trip</button>
        </div>
        }

        {!props.isPlanned && props.trips.length > 0 &&
          <div>
        <form onSubmit={props.createNewPlanned} name={props.activityID}>
          <input id='newPlanned' type='text' placeholder='Add title for your first planned trip!'/>
          <input type='submit' value="Create Planned Trip" />
        </form>
                or
          <button name={props.activityID} onClick={props.switchNewPlanned}>Add to existing plans</button>
          <button name={props.activityID} onClick={props.handleRemoveSaved}>Remove</button>
          </div>
        }


      </div>

    </div>
  )
}

export default SavedOverview
