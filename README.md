# EnergyBase to JSON Gateway

EnergyBase has a not so easy to use unofficial API.
This small script privides an easier to use interface for that API via a webserver serving the data as JSON.

## Install

### Requirements

- nodejs
- npm (often included with nodejs)
- git

### Get Sourcecode

(All lines starting with ```$``` are bash commands)

```sh
$ git clone git@github.com:Snapstromegon/EnergyBaseGateway.git
$ cd EnergyBaseGateway
```

### Install dependencies

```sh
$ npm install
```

## Configureing the Gateway

- Copy __config_template.js__ to __config.js__ and fill in your EnergyBase URL and password.
- Optionally change the port of the webserver (default is 8888)

## Launching the Server

```sh
$ npm start
```

## ⚠ Warning

This Gateway has no means of security and answers anyone who asks, so please don't make it accessible from the internet.

Also in its current state it makes a request to the EnergyBase server for each request you make to it.
That way it's a little slower in the response time, but it should be fine.
Don't worry too much about rate limits, as the original api made about one request per second.
