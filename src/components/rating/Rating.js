import React from 'react'

class Rating extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stars: this.props.stars,
      isEnabled: props.isEnabled
    }
    this.starClick = this.starClick.bind(this)
  }
componentDidUpdate(){
if (this.props.stars !== this.state.stars){
  this.setState({
    stars:this.props.stars
  })
  console.log(this.state.stars)
}
}
  starClick (number) {
    if (this.state.isEnabled) {
      this.props.starClick(number)
      this.setState({
        stars: number
      })
    }
  }

  render () {
    return (
      <div>
        <span className={'star ' + (this.state.stars >= 1 ? 'bright ' : 'dull ') + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(1)}>Star</span>{' '}
        <span className={'star ' + (this.state.stars >= 2 ? 'bright ' : 'dull ') + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(2)}>Star</span>{' '}
        <span className={'star ' + (this.state.stars >= 3 ? 'bright ' : 'dull ') + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(3)}>Star</span>{' '}
        <span className={'star ' + (this.state.stars >= 4 ? 'bright ' : 'dull ') + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(4)}>Star</span>{' '}
        <span className={'star ' + (this.state.stars >= 5 ? 'bright ' : 'dull ') + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(5)}>Star</span>{' '}
      </div>
    )
  }
}

export default Rating
