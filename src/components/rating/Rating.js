import React from 'react'

class Rating extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stars: props.stars
    }
    this.starClick = this.starClick.bind(this)
  }

  starClick (number) {
    this.props.starClick(number)
    this.setState({
      stars: number
    })
  }

  render () {
    return (
      <div>
        <span className={'star ' + (this.state.stars >= 1 ? 'bright' : 'dull')} onClick={() => this.starClick(1)}>Star</span>
        <span className={'star ' + (this.state.stars >= 2 ? 'bright' : 'dull')} onClick={() => this.starClick(2)}>Star</span>
        <span className={'star ' + (this.state.stars >= 3 ? 'bright' : 'dull')} onClick={() => this.starClick(3)}>Star</span>
        <span className={'star ' + (this.state.stars >= 4 ? 'bright' : 'dull')} onClick={() => this.starClick(4)}>Star</span>
        <span className={'star ' + (this.state.stars >= 5 ? 'bright' : 'dull')} onClick={() => this.starClick(5)}>Star</span>
      </div>
    )
  }
}

export default Rating
