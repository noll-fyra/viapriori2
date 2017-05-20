import React from 'react'
import db, {auth} from '../../utils/firebase'

// let userTripsDB = auth.currentUser ? db.ref(auth.currentUser.uid + '/trips') : 5

// if (auth.currentUser) {
// userTripsDB = db.ref(auth.currentUser.uid + '/trips')
// }

class MyTrips extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    database: {},
    names: props.names
  }
}

componentDidMount () {
  // console.log(auth.currentUser);
  db.ref('trips/' + auth.currentUser.uid).on('value', (snapshot) => {
    this.setState({
      database: snapshot.val()
    })
    // const tripnames = []
    // for (var key in this.state.database) {
    //   tripnames.push(Object.keys(this.state.database[key])[0])
    // }
    // this.setState({
    //   names: tripnames
    // })
    // console.log(this.state.database);
  })
}

  render() {
    // console.log(hi);
const deets = []
for(var key in this.state.database){
  deets.push(this.state.database[key])
}
let ok = deets.map((trip) => {
  return (<li><div>
    <p>name:{trip.title}</p>
    <p>details:{trip.details}</p>
    <p>date:{new Date(trip.date).toLocaleDateString()}</p>
  </div></li>
  )
})

  //   const tripnames = this.state.database ? this.state.database.map((trip, index)=> {
  //     if (auth.currentUser) {
  //       console.log(trip);
  //     // return <li key={index}>{db.ref('trips/' + auth.currentUser.uid + trip.keys[0]).title}</li>
  //   } else {
  //     return <li>none</li>
  //   }
  // }) : null
    return (
      <div>
        NAMES: {this.state.names}
      <ul>

        {/* // {tripnames} */}
        {ok}
      </ul></div>
    );
  }

}

export default MyTrips;
