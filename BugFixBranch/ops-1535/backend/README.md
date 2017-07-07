# Itheon 10 - Backend API 

This API is used in-conjunction with the Itheon 10 frontend

Install dependencies : 
```
$ npm install
```
Start up the server :
```
$ forever start server.js
```

API endpoints at ```localhost:8000/api/``` :

| Method | Path | Parameters |  Protected |     |
| :---: | :---: | :---: | :---: | :--- |
| GET | /device | - - - | isAuthorized | Return a list of devices|
| GET | /rule | - - - | isAuthorized | Return a list of device rules|
| GET | /metric | - - - | isAuthorized | Return a list of device metrics|
| POST | /user | username : password : email : title : role | isAuthorized | Create a User and returns token|
| GET | /user | - - - | isAuthorized | Returns List of User Objects |
| GET | /user/:id | - - - | isAuthorized | Returns the user with the given ID |
| PUT | /user/:id | - - - | isAuthorized, isCurrentUser | Updates user with the a given ID |
| DEL | /user/:id | - - - | isAuthorized, isCurrentUser | Deletes a user with the given ID |
| POST | /login | username : password | none | Log In Route : Returns logged in user and token |



For all ```isCurrentUser``` protected routes, the target the route's target user must be the user accessing that endpoint.

For all ```isAuthorized``` protected routes, be sure to include an ```Authorization``` header with the value ```Bearer [YOUR-TOKEN]```

[![Build Status](http://10.187.75.150:9443/view/unit-test/job/Build%20-%20itheon-10-backend/badge/icon)](http://10.187.75.150:9443/view/unit-test/job/Build%20-%20itheon-10-backend/)