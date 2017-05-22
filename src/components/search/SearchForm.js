import React from 'react'

const SearchForm = (props) => (
  <input type='text' placeholder='Search by Activities, Location or User' onChange={props.onChange} />
)

export default SearchForm
