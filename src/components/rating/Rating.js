import React from 'react'
import './rating.css'

class Rating extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stars: this.props.stars,
      isEnabled: props.isEnabled
    }
    this.starClick = this.starClick.bind(this)
  }

  componentDidUpdate () {
    if (this.props.stars !== this.state.stars) {
      this.setState({
        stars: this.props.stars
      })
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
        <span className={'star ' + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(1)}>{this.state.stars >= 1 ? <img src={require('./filled_star_by_zaff_studio_from_noun_project.png')} alt='filled_star_by_zaff_studio_from_noun_project.png' /> : <img src={require('./unfilled_star_by_zaff_studio_from_noun_project.png')} alt='unfilled_star_by_zaff_studio_from_noun_project.png' />}</span>{' '}
        <span className={'star ' + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(2)}>{this.state.stars >= 2 ? <img src={require('./filled_star_by_zaff_studio_from_noun_project.png')} alt='filled_star_by_zaff_studio_from_noun_project.png' /> : <img src={require('./unfilled_star_by_zaff_studio_from_noun_project.png')} alt='unfilled_star_by_zaff_studio_from_noun_project.png' />}</span>{' '}
        <span className={'star ' + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(3)}>{this.state.stars >= 3 ? <img src={require('./filled_star_by_zaff_studio_from_noun_project.png')} alt='filled_star_by_zaff_studio_from_noun_project.png' /> : <img src={require('./unfilled_star_by_zaff_studio_from_noun_project.png')} alt='unfilled_star_by_zaff_studio_from_noun_project.png' />}</span>{' '}
        <span className={'star ' + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(4)}>{this.state.stars >= 4 ? <img src={require('./filled_star_by_zaff_studio_from_noun_project.png')} alt='filled_star_by_zaff_studio_from_noun_project.png' /> : <img src={require('./unfilled_star_by_zaff_studio_from_noun_project.png')} alt='unfilled_star_by_zaff_studio_from_noun_project.png' />}</span>{' '}
        <span className={'star ' + (this.state.isEnabled ? 'starenabled' : 'stardisabled')}
          onClick={() => this.starClick(5)}>{this.state.stars >= 5 ? <img src={require('./filled_star_by_zaff_studio_from_noun_project.png')} alt='filled_star_by_zaff_studio_from_noun_project.png' /> : <img src={require('./unfilled_star_by_zaff_studio_from_noun_project.png')} alt='unfilled_star_by_zaff_studio_from_noun_project.png' />}</span>{' '}
      </div>
    )
  }
}

export default Rating
