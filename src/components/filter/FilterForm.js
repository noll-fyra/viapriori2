import React from 'react'

const FilterForm = (props) => (
  <input type='text' placeholder={props.placeholder} onChange={props.onChange} onKeyUp={props.onKeyUp} />
)

export default FilterForm
