![]()
# **EdnoTracks RESTful API**

* **Amanda Koster** makes visual sense of mental spaghetti. Hailing from a visual content and creative background, she is addicted to the wizardry of code. She leverages her creative, visual background and full-stack JavaScript skills to squash inefficiencies between design UX and dev.
* **Jeff Ford** is a native of Aberdeen, WA. He spent several years working in politics in Washington state, and Washington, DC. He is a graduate of the University of Washington, and spent 13 years in the Army Reserves. In his most recent role, Jeff served as company commander of a logistics unit during a deployment to Afghanistan.
* **Kyle Aardal**
* **Scott Mccoy**
------------
### Overview
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
### How To Login: SCOTT
Required:
* Username, email
* How do users log in?
* Difference between a User and a Profile
*
--------
## ROUTES
### USERS
##### POST /api/users/signup
Required Data:
* User ID
* User Name
* Skill Level
* Riding Style
* Photo (avatar)
?? This route will create a new user account. Users will then be able to complete their profiles, and add new trails.

### GET /api/users/login
This route allows existing users to return to the application and access all of its features.

Required Data:
*

#### DELETE /api/users/delete

### PROFILES
#### POST /api/users/signup
Required Data:
* Username
* Password
* Email
*
This route will create a new user account. Users will then be able to complete their profiles, and access the application’s features.

#### GET /api/profiles
This route allows users to view their own profile and profiles of other riders in the community.
#### PUT /api/profiles
This route allows users to update their existing profile, including adding their skill level and riding style, or uploading a profile picture.

### TRAILS
#### POST /api/trails
Required Data:
* Trail name
* Difficulty
* Type
* Distance
* Elevation
* Lat (latitude)
* Long (longitude)
* Zoom (radius)
* Map (image)

This route creates a new trail with the relevant information that users are seeking when using the application. It provides the location of the trail, along with the type and difficulty. Users posting #new trails will also upload images so riders can see what a trail actually looks like.

#### GET /api/trails
This route allows users to access the database of trails that their peers in the community have created.
Required Data:
* Trail name

#### PUT /api/trails
This route allows users to update existing trails existing in the application. Importantly, images and difficulty can be updated based on the current conditions of the trail.

Required Data:
* Trail name
*
#### DELETE /api/trails/delete
