import React from 'react'
import db, {auth, storage} from '../../utils/firebase'

class New extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      imagePath: '',
      imageName: 'Add an image',
      imageLocation: '',
      imageDate: '',
      description: ''
    }
    this.addedTitle = this.addedTitle.bind(this)
    this.addedStart = this.addedStart.bind(this)
    this.addedEnd = this.addedEnd.bind(this)
    this.addedFile = this.addedFile.bind(this)
    this.addedDescription = this.addedDescription.bind(this)
    this.addActivity = this.addActivity.bind(this)
  }

  addedTitle (e) {
    this.setState({
      title: e.target.value
    })
  }

  addedStart (e) {
    this.setState({
      start: e.target.value
    })
  }

  addedEnd (e) {
    this.setState({
      end: e.target.value
    })
  }

  addedFile (e) {
    this.setState({
      imagePath: e.target.files[0],
      imageName: e.target.files[0].name
    })
  }

  addedDescription (e) {
    this.setState({
      description: e.target.value
    })
  }

  addActivity () {
    console.log(this.state.imagePath)
    storage.ref(auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName).put(this.state.imagePath).then((snap) => {
      db.ref('trips/' + auth.currentUser.uid + '/' + this.props.tripid + '/sections').push({
        title: this.state.title,
        start: this.state.start,
        end: this.state.end,
        image: auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName,
        description: this.state.description
      })
    })
  }

  render () {
    return (
      <div>
        <div className='backdrop' onClick={this.props.onClose} />
        <div className='modal'>
          <label>
            <span>{this.state.imageName}</span>
            <input className='fileInput' type='file' onChange={(e) => this.addedFile(e)} />
          </label>
        </div>
        {this.state.imagePath !== '' &&
        <div className='modal modal2'>
          <p><input type='text' onChange={(e) => this.addedTitle(e)} placeholder='Title' /></p>
          <p><input type='date' onChange={(e) => this.addedStart(e)} /></p>
          <p><input type='date' onChange={(e) => this.addedEnd(e)} /></p>
          <p><textarea onChange={(e) => this.addedDescription(e)} /></p>
          <button onClick={this.addActivity}>Post</button>
        </div>
        }
      </div>
    )
  }
}

export default New
