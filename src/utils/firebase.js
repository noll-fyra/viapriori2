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

export default db
export {auth, storage, storageKey}
export const isAuthenticated = () => {
  return !!auth.currentUser
}
