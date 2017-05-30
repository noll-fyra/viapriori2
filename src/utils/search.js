// search/filter
function search (e) {
  let searchQuery = e.target.value.toLowerCase()
  console.log(searchQuery);
  this.setState({
    searchQuery: searchQuery
  })

}

export default search
