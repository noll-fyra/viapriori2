import React from 'react';
import TripSearchForm from '../tripsearchform/TripSearchForm'
import TripItem from '../tripitem/TripItem'
class TripList extends React.Component {
constructor(props){
  super(props);
  this.state = {
    tripDisplayed: props.trips,
  };
}

tripSearch(e){
  let searchQuery = e.target.value.toLowerCase()
  this.setState((prevState,props) => {
    let searchedTrips = props.trips.filter((trip) => {
      let lowercaseTrip = trip.toLowerCase()
      return lowercaseTrip.includes(searchQuery)

    // to add in the filters for the other properties of trips(activities name/User name, when database tables are up)
    })
  return{
    tripDisplayed: searchedTrips
  }
  })
}

tripDetails(e){
  // console.log(key)

  let tripDisplayed = this.state.tripDisplayed
  let index = e.target.getAttribute('name')
  let selectedTrip = tripDisplayed[index]


  // let searchQuery = e.target.value.toLowerCase()
  this.setState((prevState,props) => {
    let selectedTrips = props.trips.filter((trip) => {
      let lowercaseTrip = trip.toLowerCase()
      return lowercaseTrip.includes(selectedTrip)
    })
  return{
    tripDetails: selectedTrip
  }
  })
}

  render() {
    return (
      <div>

        <TripSearchForm handleSearch= {
          (e) => this.tripSearch(e)
        }/>
        <h1> Featured Trips</h1>
        {this.state.tripDisplayed &&
          <TripItem tripItems= {this.state.tripDisplayed} tripDetails = {(e) => this.tripDetails(e)}/>
        }
        {this.state.tripDetails}
      </div>
    );
  }
  // componentDidUpdate(){
  //   fetch('http://www.omdbapi.com/?s=Batman')
  //   .then((response)=>{
  //     console.log('this is from the first then', response)
  //     return response.json()
  //   })
  //   .then((json)=>{
  //     console.log('actual data', json)
  //     let results = json.Search
  //     let batmans = results.map((batmanMovie,index)=>{
  //       return batmanMovie.Title
  //     })
  //     this.setState({
  //   movieDisplayed: batmans
  //     })

    // let searchQuery = e.target.value.toLowerCase()
      // this.setState((prevState, batmans) => {
        // let searchedMovies = prevState.movies.filter((movie) => {
        //   let lowercaseMovie = movie.toLowerCase()
          // return batmans
          // lowercaseMovie.includes(searchQuery)
        // })
      // return{
      //   movieDisplayed: batmans
      // }

    // })
    // .catch((error)=>{
    //   alert(error)
    // })
  // }

}

export default TripList;
