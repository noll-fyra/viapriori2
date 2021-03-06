import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ActivityOverview from '../activity/ActivityOverview'
import db, {storageKey} from '../../utils/firebase'
import {trendingObjectToArray} from '../../utils/format'
import './home.css'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      users: {},
      keys: [],
      activities: [],
      trending: [[], [], [], []],
      numberToShow: 5,
      total: 0,
      hasMore: true,
      filter: '',
      filteredKeys: [],
      filteredActivities: []
    }
    this.loadMore = this.loadMore.bind(this)
  }

  componentDidMount () {
    // fetch trending
    db.ref('trending').on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({
          trending: trendingObjectToArray(snapshot.val())
        })
      }
    })

    // fetch all activities
    db.ref('activities').on('value', snapshot => {
      if (snapshot.val()) {
        let keys = Object.keys(snapshot.val())
        let activities = new Array(keys.length).fill(null)
        for (var key in snapshot.val()) {
          let ind = keys.indexOf(key)
          activities[ind] = [keys[ind], snapshot.val()[keys[ind]]]
        }
        this.setState({
          keys: keys,
          activities: activities,
          total: keys.length
        })
      }
    })

    // fetch all usernames
    db.ref('users').on('value', snapshot => {
      let users = snapshot.val() || {}
      this.setState({
        users: users
      })
    })

    // fetch user following
    if (window.localStorage[storageKey]) {
      db.ref('users/' + window.localStorage[storageKey]).on('value', snap => {
        let filter = snap.val() && snap.val().following ? Object.keys(snap.val().following) : []
        filter.push(window.localStorage[storageKey])
        this.setState({
          filter: filter
        })
      })
    }
  }

  loadMore () {
    let newNumber = this.state.numberToShow + 5
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
    // sort latest first and show top 30 trending activities, your own activities and those from users you follow
    const reverseActivities = this.state.activities.filter((activity, index) => { return this.state.filter.includes(activity[1].user) || this.state.trending[2].slice(0, 30).includes(activity[0]) }).reverse().slice(0, this.state.numberToShow).map((activity, index) => {
      return (
        <div className='homeActivityOverview' key={activity[0]}>
          <ActivityOverview
            activityID={activity[0]}
            activity={activity[1]}
            clickToSearch={this.props.clickToSearch}
            areImagesHidden={false}
            image={activity[1].user && (this.state.users[activity[1].user]).profile && (this.state.users[activity[1].user]).profile.profileImage ? this.state.users[activity[1].user].profile.profileImage : ''}
            user={activity[1].user || 'hello'}
            username={activity[1].user && this.state.users[activity[1].user] && (this.state.users[activity[1].user]).profile ? (this.state.users[activity[1].user]).profile.username : ''}
            type='home'
           />
        </div>
      )
    })

    return (
      <div className='homeContainer'>
        <div className='trending'>
          <h3>Trending</h3>
          <ul>
            <li className='trendingHeading'><b>Cities</b></li>
            {this.state.trending[1].slice(0, 10).map((tag, index) => { return <li key={tag + index}><button onClick={() => this.props.clickToSearch(tag)}>{tag}</button></li> })}
            <li className='trendingHeading'><b>Countries</b></li>
            {this.state.trending[0].slice(0, 10).map((tag, index) => { return <li key={tag + index}><button onClick={() => this.props.clickToSearch(tag)}>{tag}</button></li> })}
            <li className='trendingHeading'><b>Tags</b></li>
            {this.state.trending[3].slice(0, 10).map((tag, index) => { return <li key={tag + index}><button onClick={() => this.props.clickToSearch(tag)}>{tag}</button></li> })}
          </ul>
        </div>
        <InfiniteScroll
          className='infinite'
          next={this.loadMore}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          >
          {reverseActivities}
        </InfiniteScroll>
        <div />
      </div>

    )
  }
}

export default Home
