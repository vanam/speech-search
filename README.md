# Speech Search
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

Search for keywords in an audio file containing speech or dialog.

## Features

* React single page application
* Audio recording via [MediaRecorder API](https://caniuse.com/#feat=mediarecorder)
* Speech to Text using [IBM Cloud API](https://console.bluemix.net/catalog/services/speech-to-text)
* Rich offline experience using [Web App Manifest](https://caniuse.com/#feat=web-app-manifest) and [Service Workers](https://caniuse.com/#feat=serviceworkers)

## Requirements:

* Chrome >=64 (since we are using bleeding edge features)
* npm >=5.6 (for development)

## Development

1. Install dependencies using `npm install`
2. Start dev version` npm start`

## Build

1. Install dependencies using `npm install`
2. Build release version using `npm build` (set `homepage` in `package.json`)
3. (Optional) In order to run build version on localhost set `"homepage": "/"` in `package.json` and run it `serve -s build`

## Deployment

#### Frontend

Application frontend is located in build folder (after running `npm build`) and contains static files ready to be deployed.

Keep in mind, that you need to set correct `homepage` (in `package.json`) before you build your App.

Otherwise application will fail to load static files. Or attribute `homepage` remove if app is hosted at the server root.

Example:
```js
  "homepage": "http://mywebsite.com/relativepath",
```

Also if you want to use the advantage of Service Workers and serve your application even if connection is down then you will need HTTPS.

#### Watson Service

Application also needs small service in order to work, which is responsible for .. TODO Michal .. and is located in server folder.
