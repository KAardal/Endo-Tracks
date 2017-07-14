# **EdnoTracks: RESTful API**

* **Amanda Koster** makes visual sense of mental spaghetti. Hailing from a visual content and creative background, she is addicted to the wizardry of code. She leverages her creative, visual background and full-stack JavaScript skills to squash inefficiencies between design UX and dev.
* **Jeff Ford** is a native of Aberdeen, WA. He spent several years working in politics in Washington state, and Washington, DC. He is a graduate of the University of Washington, and spent 13 years in the Army Reserves. In his most recent role, Jeff served as company commander of a logistics unit during a deployment to Afghanistan.
* **Kyle Aardal**
* **Scott Mccoy**
------------
## Overview
The Pacific Northwest is rich with excellent bike trails for all types of riders, but the riding community is currently lacking a reliable resource to learn about trails prior to riding them.

Endo Tracks fills that gap by allowing riders to share their experiences with the community.  This application allows riders to maximize their time, and removes the guesswork when checking out new trails.

Endo Tracks provides an infrastructure and data persistence that can be easily consumed by applications (both client and web based) using the reliable and proven standards of a RESTful API. By providing this API and supporting infrastructure, we are encouraging developers to create applications that can provide value to the mountain bike community.

This RESTful API provides the necessary back-end infrastructure and functionality to create, get, update and delete data related to mountain bike trails.
When a user creates an account, you can use the User model for authorization purposes on CRUD operations for the Profile and Trail models.

------
### Current Version (1.0.0)
The current version of Endo Tracks allows users to:
Sign up for an account with a unique username, e-mail, and password.

Update a profile that includes their skill level, riding style, and profile avatar.
 Create, update, or delete bike trails to the application that includes the trail location (long, lat, zoom or radius), length, type, difficulty, elevation, and map images.

--------
### Future Releases
The next release of Endo Tracks will add a user comments feature. Once a trail is added, users will be able to share their personal experiences with the community in comment fields.

Users will also be able to upload a photo, write a comment, and rate the trail.

--------
### Architecture
![image of architecture]
(https://drive.google.com/file/d/0ByEi7DgDI5yXOFFFdVJENGRONnM/view?usp=sharing)
---
### Technologies:
* node.js server
* node.http module
* express middleware
* mongo database
* mongoose
* AWS S3 storage
* bcrypt
* crypto
* .env
* fs-extra
* jsonwebtoken
* morgan
vmulter

--------
### Storage and deployment:
Images for profile avatars and trail maps are stored to AWS S3 and served to the MongoDB via an S3 generated URI.
All models are saved under the MongoDB database.
The Mongo DB is hosted by Heroku and the application is deployed by Heroku.

--------
### Middleware:
The express router middleware provides the base routing capability.

An error-handler module implements and extends the middleware package.

An auth middleware module leverages three npm modules (bcrypt, crypto, jsonwebtoken) and the node.crypto module to provide user sign-up and user sign-in functionality as well as session authentication/authorization.

The mongoose client module creates new schemas in the mongo database and executes CRUD operations on Mongo documents.

S3 middleware allows media to be stored in the S3 database after authorization has occurred, and the multer module parses it.

--------
### Model:
When data is passed through, each model (based on mongoose schema) has its own unique module to construct a new resource object.

Exception: A profile is created upon initial user sign-up.  This profile can be update by the user in the future.

--------
### How to start the server:
Start the server - npm start
Start the database - npm start-db
Stop the database - npm stop-db
Run tests - npm test

--------
### How a new user would sign up:
##### Request: POST
Route to pass data to: https://endo-tracks.herokuapp.com/api/users/signup
###### Required Data:
userName: ‘<new user>’ - a unique string
Password: ‘<new password>’ - a string
Email: ‘<new email>’ - a unique string requiring ‘@’ symbol
###### Back end operations:
Password is deleted from the request, passed in to create a password hash using bcrypt.
A token seed is created using crypto.
A token is returned to the user if all previous conditions are met.

### When a user logs in.
##### Request: GET
Route to pass data to: https://endo-tracks.herokuapp.com/api/users/login
###### Required Data:
userName: ‘users name’
Password: ‘users password’
###### Back end operations:
User name and password are sent through the basic authorization middleware and returned a token if passing.
When a user wants to CREATE/UPDATE/DELETE a trail or UPDATE their profile.
User logs in and receives authorization token. (see above)
Update their profile.

##### Request: PUT
Route to pass data to: https://endo-tracks.herokuapp.com/api/profiles/
###### Required Data:
userName: ‘users name’ - to find the profile
Optional data to update:
skillLevel: ‘their level’ - string
ridingStyle: ‘their style’ - string
avatarURI: ‘image file from users local’ - converts to string

###### Back end operations:
User is returned the updated profile.
Retrieve profiles.
NOTE: this route is public and does not require user auth.
##### Request: GET
Route to pass data to: https://endo-tracks.herokuapp.com/api/profiles/

If no data is passed in: Returns all profiles from the database
If data is passed in:
* ###### Required Data:
* userName: ‘users name’ - to find the profile
###### Back end operations:
* Returns single profile by userName.

--------
## ROUTES
### USERS
User Schema:
```javascript
const userSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  userName: {type: String, required: true, unique: true, minlength: 2},
  email: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
});
```

##### POST /api/users/signup
###### Required Data:
* User ID
* User Name
* Skill Level
* Riding Style
* Photo (avatar)
?? This route will create a new user account. Users will then be able to complete their profiles, and add new trails.

### GET /api/users/login
This route allows existing users to return to the application and access all of its features.


#### DELETE /api/users/delete

### PROFILES
Profile Schema:
```javascript
const profileSchema = mongoose.Schema({
	userID: {type: mongoose.Schema.Types.ObjectId, required: true},
	userName: {type: String, required: true, unique: true},
	skillLevel: {type: String},
	ridingStyle: {type: String},
	photoURI: {type: String},
});
```
------
### TRAILS
```javascript
const trailSchema = mongoose.Schema ({
  trailName: {type: String, required: true, unique: true},
  mapURI: {type: String, required: true, unique: true},
  difficulty: {type: String, required: true, unique: true},
  type: {type: String, required: true, unique: true},
  distance: {type: String, required: true, unique: true},
  elevation: {type: String, required: true, unique: true},
  lat: {type: String, required: true, unique: true},
  long: {type: String, required: true, unique: true},
  zoom: {type: String, required: true, unique: true},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
});
```
### Retrieve Trails.
NOTE: this route is public and does not require user auth.
###### Request: GET
Route to pass data to: https://endo-tracks.herokuapp.com/api/trails
###### Required Data:
trailName: ‘trail name’ - to find the trail
###### Back end operations:
Returns single trail by trailName.
### Create/Update a trail.
Note: Authorization is required.
###### Request: POST / PUT
Route to pass data to: https://endo-tracks.herokuapp.com/api/trails/
###### Required Data:
trailName: ‘trail name’
###### Optional data to update (required for POST):
* mapUIR: ‘image file from users local’ - converts to string
* Difficulty: ‘difficulty’ - string
* Type: ‘type of riding’ - a unique string
* distance: ‘distance’ - string
* Elevation: ‘ elevation’ - string
* lat: ‘lat’ - string
* Long: ‘long’ - string
* Zoom: ‘zoom’ - string

###### Back end operations:
Trail is returned.

Put in the middle ware for error handler-
Errors are being handled for pathname.

#### DELETE /api/trails/delete
