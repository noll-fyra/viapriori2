import * as firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyCQXrdf9q_2vLoLSktz9y_feIxljBLESo8',
  authDomain: 'via-priori.firebaseapp.com',
  databaseURL: 'https://via-priori.firebaseio.com',
  storageBucket: 'via-priori.appspot.com'
}
firebase.initializeApp(config)

const db = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()
const storageKey = 'KEY_FOR_LOCAL_STORAGE'
const storageEmail = 'KEY_FOR_LOCAL_EMAIL_STORAGE'

export default db
export {auth, storage, storageKey, storageEmail}
export const isAuthenticated = () => {
  return !!auth.currentUser || !!window.localStorage.getItem(storageKey)
}
export const logOut = () => {
  const authPromise = auth.signOut()
  authPromise.then(()=>{
    console.log('hello');
  })
  // console.log(this);
  // this.setState({
  //   uid: null
  // })
}

// const authPromise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
// authPromise
// .then((user) => {
//   this.setState({
//     currentUser: auth.currentUser,
//     redirectToReferrer: true
//   })
// })
// .catch((error) => { console.log(error.message) })
