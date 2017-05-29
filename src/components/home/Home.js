import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ActivityOverview from '../activity/ActivityOverview'
import db from '../../utils/firebase'
import {allObjectToArray, trendingObjectToArray} from '../../utils/format'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: [],
      activities: [],
      all: [[], [], [], []],
      trending: [[], [], [], []],
      showing: [],
      numberToShow: 5,
      total: 0,
      hasMore: true
    }
    this.loadMore = this.loadMore.bind(this)
  }

  componentDidMount () {
    // fetch all trips
    db.ref('activities').on('value', snapshot => {
      const keys = []
      const activities = []
      for (var key in snapshot.val()) {
        keys.push(key)
        activities.push(snapshot.val()[key])
        this.setState({
          keys: keys,
          activities: activities,
          total: keys.length
        })
      }
    })

    // fetch all and trending
    db.ref('all').on('value', snapshot => {
      this.setState({
        all: allObjectToArray(snapshot.val())
      })
    })
    db.ref('trending').on('value', snapshot => {
      this.setState({
        trending: trendingObjectToArray(snapshot.val())
      })
    })
  }

  loadMore () {
    this.setState({
      showing: this.state.activities.slice(0, this.state.numberToShow)
    })
    let newNumber = this.state.numberToShow + 10
    setTimeout(() => {
      this.setState({
        numberToShow: newNumber
      })
      if (this.state.numberToShow >= this.state.total && this.state.total !== 0) {
        this.setState({
          hasMore: false
        })
      }
    }, 500)
  }

  render () {
    const reverseActivities = this.state.showing.reverse().map((activity, index) => {
      return <ActivityOverview key={this.state.keys[index]} activityID={this.state.keys.slice().reverse()[index]} activity={activity} />
    })
    return (
      <div>
        <div className='trending'>
          <b>Trending</b>
          <ul>
            <li><b>countries</b></li>
            {this.state.trending[0].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
            <li><b>cities</b></li>
            {this.state.trending[1].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
            <li><b>saved</b></li>
            {this.state.trending[2].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
            <li><b>tags</b></li>
            {this.state.trending[3].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
          </ul>
          <b>Evergreen</b>
          <ul>
            <li><b>countries</b></li>
            {this.state.all[0].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
            <li><b>cities</b></li>
            {this.state.all[1].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
            <li><b>saved</b></li>
            {this.state.all[2].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
            <li><b>tags</b></li>
            {this.state.all[3].slice(0, 10).map((tag) => { return <li key={tag}>{tag}</li> })}
          </ul>
        </div>
        <InfiniteScroll
          next={this.loadMore}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          >
          {reverseActivities}
        </InfiniteScroll>
      </div>
    )
  }
}

export default Home
