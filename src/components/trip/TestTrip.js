import React from 'react'
import db, {auth} from '../../utils/firebase'
import AddSection from './AddSection'

class TestTrip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      form: []
    }
    // this.changeForm = this.changeForm.bind(this)
  }

  // changeForm (type, value) {
  //   form: this.state.form.append[type, value]
  // }

  render () {
    let trip
    db.ref('trips/' + auth.currentUser.uid + '/' + this.props.match.params.id).on('value', data => {
      trip = data.val()
    })

    return (
      <div>
        <div>{JSON.stringify(trip)}</div>
        <AddSection tripid={this.props.match.params.id} />
      </div>
    )
  }

}

export default TestTrip
