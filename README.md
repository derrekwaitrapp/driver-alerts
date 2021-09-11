# driver-alerts

### Pre-requisites
```
npm install sails -g
```

### Install instructions
```
npm install
```
### Development Start - Require for first time to run migrations
```
sails lift
```
### Production Start - Not needed if using development mode
```
npm start
```

Navigate to http://localhost:1337 to view the alert and output data.
The server also has a bit more detailed output data in the console log.

### The System
The system uses a fake phone to send data to the api which then sends the data to the front end via realtime websockets events.

### Logic
The system checks the new incoming GeoLocation data on create and does a time calculation to get the last 30 second of GeoLocations, If there is enough data and all GeoLocations are the same for the last 30 second the system with send an alert through a websocket to the front end which will display a modal that the driver can close but the modal will pop back up if the driver is still in the location on the next geolocation update. Once the driver begins to drive these alerts will stop. The system will not send more than one alert `per location` at a time unless it has been `closed` or `I understand` has been pressed. This driver drives around the block and makes 2 long stops and one short stop. Generally a long stop is about 6 insertions because the phone is only updating the location every 5 seconds. Over all he should get 2 popup during his around the block trip before he goes around the block again.

### Where to find the code
`config/bootstrap.js` The startup/seed code and the fake phone reporting the fake route data.

`models/Alert` The alerts model that get triggered to the user

`api/models/Driver` The driver model where the driver is stored

`api/models/GeoLocation` The GeoLocations model where the check for the long stop is made. After every create is made on the GeoLocation a calculation is done to check if the driver has been stopped for 30 seconds in the same position.

`assets/js/driver.js` Where the front end js code is for listening to the real time websocket events

`views/homepage.ejs` Where the front view with the driver updates html is located

`views/layouts/layout.ejs` This is a partial that contains the navigation, css, js page includes



