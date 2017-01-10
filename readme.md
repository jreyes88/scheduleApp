<snippet>
  <content><![CDATA[
# ${1:KLRU Schedule}
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
$ cd node-pbs-tv-schedules
$ npm start
```
The application will then be served up at localhost:3000/
## Credits
Built on the fantastic KQED Node PBS TV Schedule module.
See
* https://github.com/KQED/node-pbs-tv-schedules

]]></content>
  <tabTrigger>readme</tabTrigger>
</snippet>