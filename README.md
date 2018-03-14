# Speech Search
Search for keywords in a sound file containing speech or dialog

## Installation

Requirements:

* Node.js v8.9.4
* npm 5.6.0
* IBM Cloud Speech-to-text service credentials

...

## Obtaining IBM Cloud credentials
1. register on [IBM Cloud](https://www.ibm.com/cloud/)
2. navigate to [IBM Cloud Dashboard](https://console.bluemix.net/dashboard/apps/)
3. browse services and find Speech-to-text service
4. add service to your dashboard
5. go back to dashboard and select created service
6. in the left panel click Service Credentials, use these credentials in watson.js

OR

you can use credentials in watson.js (100 min audio limit, might run out)

## Configuration

1. run `npm install` from command line
2. run `node watson.js` from command line

## Example usage

1. run node watson.js from command line
2. prints out info about english model
3. prints out JSON file with recognized parts of audio
4. prints out found keywords
