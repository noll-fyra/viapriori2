import * as firebase from 'firebase'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET
}

firebase.initializeApp(config)

const db = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()
const storageKey = 'KEY_FOR_LOCAL_STORAGE'

export default db
export {auth, storage, storageKey}
export const isAuthenticated = () => {
  return !!auth.currentUser || !!window.localStorage.getItem(storageKey)
}
