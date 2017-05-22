import React from 'react';

const TripSearchForm = (props) => (

    <form>
      <input type='text' placeholder="Search by Activities, Location or User
" onChange={props.handleSearch}/>
    </form>
);


export default TripSearchForm;
