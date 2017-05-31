import db from './firebase'

// update database counts
function updateDB (path, item, value) {
  db.ref(path).once('value').then((snap) => {
    let newObj = snap.val() || {}
    newObj[item] = value
    db.ref(path).set(newObj)
  })
}

// update database counts
function updateDBPlusOne (path, item) {
  db.ref(path).once('value').then((snap) => {
    let newObj = snap.val() || {}
    newObj[item] = newObj[item] ? newObj[item] + 1 : 1
    db.ref(path).set(newObj)
  })
}

export default updateDB
export {updateDBPlusOne}
