import React from 'react'
import './searchform.css'

// require('./search_by_deepz_from_noun_project.png')
const SearchForm = (props) => (
  <div className='searchbarContainer'>
    <input className='searchBar' type='text' placeholder={props.placeholder} onChange={props.onChange} onKeyUp={props.onKeyUp} />
  </div>
)

export default SearchForm
