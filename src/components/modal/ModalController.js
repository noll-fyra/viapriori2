import React from 'react'

import NewTrip from '../trip/NewTrip'

const ModalController = props => {
  switch (props.currentModal) {
    case 'newTrip':
      return <NewTrip {...props} />

    default:
      return null
  }
}

export default ModalController
