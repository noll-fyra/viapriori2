function search (e) {
  let searchQuery = e.target.value.toLowerCase()
  this.setState((prevState, props) => {
    // let searched = prevState.userTrips.filter((trip) => {
    //   let lowercaseTrip = trip.toLowerCase()
    //   return lowercaseTrip.includes(searchQuery)
    // })
    return {
      searchQuery: searchQuery
    }
  })
}

export default search
