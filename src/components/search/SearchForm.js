import React from 'react'

const SearchForm = (props) => (
  <input type='text' placeholder={props.placeholder} onChange={props.onChange} onKeyUp={props.onKeyUp} />
)

export default SearchForm
