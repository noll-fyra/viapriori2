import React from 'react'
import db, {auth, storage} from '../../utils/firebase'

class AddSection extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      start: null,
      end: null,
      imagePath: '',
      imageName: 'Add an image',
      description: ''
    }
  // this.addImage = this.addImage.bind(this)
  // this.addText = this.addText.bind(this)
  // this.updateForm = this.updateForm.bind(this)
    this.addedTitle = this.addedTitle.bind(this)
    this.addedStart = this.addedStart.bind(this)
    this.addedEnd = this.addedEnd.bind(this)
    this.addedFile = this.addedFile.bind(this)
    this.addedDescription = this.addedDescription.bind(this)
    this.addActivity = this.addActivity.bind(this)
  }

// addImage() {
// this.setState({
//   form: this.state.form.concat(['<p><img src= /></p>'])
// })
// }
//
// addText() {
// this.setState({
//   form: this.state.form.concat(['<p><textarea></textarea><p>'])
// })
// }

// updateForm(e){
//   console.log(this.state.form)
//   this.setState({
//     form: e.target.innerHTML
//   })
// }
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
    console.log(this.state.imagePath);
    storage.ref(auth.currentUser.uid + '/' + this.props.tripid + '/images/' + this.state.imageName).put(this.state.imagePath).then((snap)=> {
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
        {/* <div onChange={(e) => this.updateForm(e)} dangerouslySetInnerHTML={{ __html: this.state.form }} /> */}
        <input type='text' onChange={(e) => this.addedTitle(e)} placeholder='Title' />
        <input type='date' onChange={(e) => this.addedStart(e)} />
        <input type='date' onChange={(e) => this.addedEnd(e)} />
        <label>
          <span>{this.state.imageName}</span>
          <input className='fileInput' type='file' onChange={(e) => this.addedFile(e)} />
        </label>
        <textarea onChange={(e) => this.addedDescription(e)} />
        {/* <label htmlFor='file'>Add an image</label> */}
        {/* <button onClick={this.addImage}>Add Image</button>
        <button onClick={this.addText}>Add Text</button> */}
        <button onClick={this.addActivity}>Add Activity</button>
      </div>
    )
  }

}

export default AddSection
