import React from 'react'
// import {Link} from 'react-router-dom'
import db, {auth, storage} from '../../utils/firebase'

class MyActs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      database: {},
      keys: [],
      details: [],
      images: []
    }
  }

  componentDidMount () {
    db.ref('activities').on('value', (snapshot) => {
      this.setState({
        database: snapshot.val()
      })
      this.displayTrip()
    })
  }

  displayTrip () {
    const keys = []
    const details = []
    for (var key in this.state.database) {
      if (this.state.database[key].user === auth.currentUser.uid) {
        keys.push(key)
        details.push(this.state.database[key])
      }
    }
    this.setState({
      keys: keys,
      details: details
    })
    details.forEach((trip, index) => {
      storage.ref(trip.image).getDownloadURL().then((url) => {
        console.log(url)
        this.setState({
          images: this.state.images.concat([url])
        })
        console.log('update', this.state.images)
      })
    })
  }

  render () {
    const x = this.state.images.map((url) => {
      return <li><img style={{width: '20%', height: '20%', imageOrientation: 'from-image'}} src={url} alt='' /></li>
    })
    return (
      <div>
        <ul>
          {x}
        </ul>
      </div>
    )
  }
}

export default MyActs
