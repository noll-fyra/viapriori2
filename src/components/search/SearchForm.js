import React from 'react';

const SearchForm = (props) => (

    <form>
      <input type='text' placeholder="Search by Activities, Location or User
" onChange={props.handleSearch}/>
    </form>
);


export default SearchForm;
