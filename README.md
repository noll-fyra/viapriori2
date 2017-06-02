# _Via Priori_
<http://via-priori.firebaseapp.com/>

## Description

**_Via Priori_** is a travel-focused social media site that is best described as Instagram x Pinterest x TripAdvisor. Users post their travel experiences in the form of _activities_ - which are combined into _trips_ - describing what happened(travel tips, budgeting, reviews) and providing their rating of the event. Other users can in turn search for activities and places, and save those that interest or are helpful to them, to plan their future trips, thus utilising the combined wisdom of the internet to decide what activities to pursue.

While Instagram is ephemeral and fleeting, Pinterest is inspirational but not functional, and TripAdvisor is convoluted and lacking context, **_Via Priori_** aims to be helpful as a record of your travels and a tool to prepare for future experiences.

---

## Getting Started
### Prerequisites

This project is built on Node. Go to <https://nodejs.org> and follow the instructions to download and install Node.

### Installing

Fork, clone or download this repository to your desired directory. You have to install the required modules listed in the _package.json_ file. This can be done automatically by entering the following code in your directory:

```
npm install
```
The project will also require a _.env_ file that contains all the secret variables used in the project. Change the file type of the included _.env.sample_ file to _.env_ and replace the values with your own.

---

## Deployment
### Hosting
This project was deployed with Firebase, but you can choose your own server host. To use Firebase, go to <https://firebase.google.com/>, create an account and follow the instructions to deploy your own project.

### Database and Storage
Firebase provides both the database and storage for the project.

## Built With
- Node
- React
- Firebase
- JavaScript
- HTML5
- CSS
- Skeleton CSS (<http://getskeleton.com>)
- Many other React component modules
- Many other Node modules

### A Note on React
This project is heavily designed with React thinking in mind, and attempts to provide a speedy and seamless user experience through liberal usage of React components. We have tried to maintain state within our components as appropriately as possible. To learn more about React, go to <https://facebook.github.io/react/>.

---

## The Project
### Objective
Our aim was to introduce an application to save travel photos with context. A trip is made up of many experiences, all of which contribute to the overall satisfaction with the trip. We wanted to show a timeline of our activities, complete with description and opinion, to better understand how each experience was defined by, and shaped, the previous and the next activity respectively.

We were inspired by Instagram in setting up our flow, as we focused on making it simple to upload activities, refer back to your trips, and find activities that interest you.

---

## Development
### Models
The structure of the Firebase database greatly affected how we built our models; it is very similar to a JSON file and we had to store our data as objects to enable easy retrieval of the information.

Although Firebase handles authentication for us, we had to create a user model to store profile details, as well as the user' trips, planned trips, saved activities, followers and people they follow. We mostly store references to them so we can find them later.

Our trips, planned trips and activities are used in a similar fashion, with a reference to any other relevant model stored in a two-way fashion when applicable.

We also save data about saved and posted places, tags and activities to use for our _trending_ feature.

![Firebase Database](http://i.imgur.com/BxhozjY.png)

### Website Wireframes
![Ugly Wireframe 1](http://i.imgur.com/ZKnqPkH.jpg)
![Ugly Wireframe 2](http://i.imgur.com/LDNZaLo.jpg)
![Proper Wireframe](http://i.imgur.com/wll0zDO.png)

### Notable Areas
#### Firebase
Firebase is our database, authentication handler, storage and host wrapped into one.

##### Firebase Database
To add an item to the database:
```javascript

let ref = firebase.database().ref('/path/to/add/to')
let newInfo = ref.push()
newInfo.set({
  details: toPush
})
// now we can use newRef.key
```
Firebase works client side to generate a unique key before pushing to the database, allowing us to create a reference to the database before actually adding an item.

To get the data:
```javascript
firebase.database().ref('/path/to/add/to').on('value', snapshot => {
  // do something with snapshot.val()
})
```
Firebase is a real-time database that can push data when an event listener is set up to watch for changes to the database.

##### Firebase Storage
Firebase storage works similarly:
```javascript
firebase.storage().ref('path/to/add/to').put('itemToStore')
```
Retrieve files via a callback:
```javascript
firebase.storage().ref('path/to/add/to').getDownloadURL().then(url => {
  // do something with the url
})
```

#### New Activities
When a new photo is added, we attempt to pre-fill the date and location of the activity through EXIF data. We also attempt to correct image orientation when possible.

#### Following and Followers
We let users follow other users. The landing page is basically your feed sorted by time, together with the posts of the users you follow.

#### Trending
Your feed also has the 30 most recently saved posts by all users. The landing page also features a trending list of _countries_, _localities_ and _tags_, which when clicked leads to the search page.

We determine what's trending by adding every uploaded and saved activity to _/trending/day/tag_. The _day_ is determined by the current day, so posts on Friday add to _/trending/Friday/tag_. At midnight every day, the server runs a scheduled job to wipe the events of the day. This ensures that our trending data is always current to the last week.

#### Search
React makes it easy to maintain the state of an application, so we simply pull all relevant data and filter by what the user enters into the search bar.

### Obstacles/Bugs
#### Warning: setState(...)
Because Firebase database and storage require callbacks to access the stored data and files, it often interferes with the React component lifecycle; we have been unable to solve these errors.

#### State management
It is often unclear where state should exist, and when the component life cycle is activated. In particular, _following_ and _followers_ were moved onto their own pages to make state management easier, at the cost of user experience. The _Follow_ and _Unfollow_ buttons are especially buggy.

#### Image orientation
We have encountered problems with displaying the uploaded images correctly; a huge contributor to the issue is that the iPhone 'sanitises' EXIF data before passing it to the browser, which makes it impossible to correct the image based on its orientation value.

### Future
This project has immense room to grow. Its primary use case will be as a native mobile app, which will have to be built with similar principles in mind. It can also use an improved recommendation engine that uses big data to predict the attractiveness of certain activities to users to improve their trip. It can also benefit from integrated social functions to help users share their trips, as well as from collaborative features for group events.

<!-- ![Locavorus Landing Page](http://i.imgur.com/KEQb77r.png) -->

---

## Contributing
This is a live project; all code contributions are welcome.

## Authors
- [Jerel Lim](https://github.com/jerel-lim)
- [Jonathan Louis Ng](https://github.com/noll-fyra)

## Acknowledgements
### Coding assistance:
- [Lee Shue Ze](https://github.com/dorkblue)
- [Darrell Teo](https://github.com/darrelltzj)
- [Cara Chew](https://github.com/smilesandcocktails)

### Image credits:
- Filled Star: Zaff Studio | Noun Project
- Logout: myladkings | Noun Project
- New: Setyo Ari Wibowo | Noun Project
- Profile: icongeek | Noun Project
- Profile: jivan | Noun Project
- Saved: Aya Sofya | Noun Project
- Search: Deepz | Noun Project
- Unfilled Star: Zaff Studio | Noun Project
- Delete: Google Images
- Logo: Max Alexander Ng

### Inspirations:
- Instagram
- Pinterest
- TripAdvisor
