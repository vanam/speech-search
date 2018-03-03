# Speech Search
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

Search for keywords in an audio file containing speech or dialog.

## Features

* Static single page application
* Audio recording via [MediaRecorder API](https://caniuse.com/#feat=mediarecorder)
* Rich offline experience using [Web App Manifest](https://caniuse.com/#feat=web-app-manifest) and [Service Workers](https://caniuse.com/#feat=serviceworkers)

## Requirements:

* Chrome >=64 (since we are using bleeding edge features)
* npm >=5.7.1 (for development)

## Example usage

You can run application using [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) plugin

Offline experience can be simulated using [Chrome DevTools](https://developer.chrome.com/devtools). In network tab check *Offline* checkbox.

## Development

Install dependencies using `npm install`.

### How to generate Service Worker

We are going to use [Workbox](https://developers.google.com/web/tools/workbox/) tool.

1) Generate configuration file:
    ```
    $ ./node_modules/workbox-cli/build/bin.js wizard
    ? What is the root of your web app (i.e. which directory do you deploy)? Manually enter path
    ? Please enter the path to the root of your web app: .
    ? Which file types would you like to precache? svg, png, xml, ico, html, json, md, js, css
    ? Where would you like your service worker file to be saved? sw.js
    ? Where would you like to save these configuration options? workbox-config.js
    To build your service worker, run

      workbox generateSW workbox-config.js

    as part of a build process. See https://goo.gl/fdTQBf for details.
    You can further customize your service worker by making changes to workbox-config.js. See https://goo.gl/gVo87N for details.
      ```

2) Generate Service Worker:
    ```
    $ ./node_modules/workbox-cli/build/bin.js generateSW workbox-config.js
    Using configuration from ./workbox-config.js.
    The service worker was written to sw.js
    20 files will be precached, totalling 204 kB.
    ```

3) Manually remove unwanted files (since we are using super simple project structure)

    * `package-lock.json`
    * `package-lock`
    * `workbox-config.js`
