function search (e) {
  let searchQuery = e.target.value.toLowerCase()
  this.setState({
    searchQuery: searchQuery
  })
}

export default search
