function search (e) {
  let searchQuery = e.target.value.toLowerCase()
  this.setState((prevState, props) => {
    return {
      searchQuery: searchQuery
    }
  })
}

export default search
