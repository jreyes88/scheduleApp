# KLRU Schedule
Application designated to improve the online TV Schedule at KLRU.
## Installation
```
$ git clone https://github.com/KLRU/KLRU-Schedule.git
$ cd KLRU-Schedule
$ npm install
```
## Usage
Note: An API Key will be needed to use this application.
See
* https://projects.pbs.org/confluence/display/tvsapi/TV+Schedules+Version+2
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ export MediaManager_API_ID='YOUR_ID'
$ export MediaManager_API_SECRET='YOUR_SECRET'
$ cd node-pbs-tv-schedules
$ node app.js
```
The application will then be served up at localhost:8080/
## Credits
Built on the fantastic KQED Node PBS TV Schedule module.
See
* https://github.com/KQED/node-pbs-tv-schedules
