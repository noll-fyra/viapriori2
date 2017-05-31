import React from 'react'
import './searchForm.css'

// require('./search_by_deepz_from_noun_project.png')
const SearchForm = (props) => (
  <div className='search-container'>
    <input className='searchbar' type='text' placeholder={props.placeholder} onChange={props.onChange} onKeyUp={props.onKeyUp} />
    <img onClick={props.ref} className='search' src={require('./search_by_deepz_from_noun_project.png')} />

  </div>
)

export default SearchForm
