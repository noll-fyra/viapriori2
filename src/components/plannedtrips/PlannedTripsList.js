import React from 'react';
// import TripSearchForm from '../tripsearchform/TripSearchForm'
// import TripItem from '../tripitem/TripItem'

class PlannedTripsList extends React.Component {
constructor(props){
  super(props);
  this.state = {
    plannedDisplayed:['america','russia', 'iceland']
  };
}
//
// tripSearch(e){
//   let searchQuery = e.target.value.toLowerCase()
//   this.setState((prevState,props) => {
//     let searchedTrips = props.trips.filter((trip) => {
//       let lowercaseTrip = trip.toLowerCase()
//       return lowercaseTrip.includes(searchQuery)
//     })
//   return{
//     tripDisplayed: searchedTrips
//   }
//   })
// }

  render() {

    return (
      <div>

        {/* <TripSearchForm handleSearch= {
          (e) => this.tripSearch(e)
        }/> */}
        <h1> Planned Trip</h1>
        <p>{this.props.planned}</p>
        {/* <TripItem tripItems= {this.state.tripDisplayed}/> */}
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

export default PlannedTripsList;
