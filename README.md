# EnergyBase to JSON Gateway

EnergyBase has a not so easy to use unofficial API.
This small script privides an easier to use interface for that API via a webserver serving the data as JSON.

## Install

### Requirements

- nodejs
- npm (often included with nodejs)
- git

### Get Sourcecode

(All lines starting with `$` are bash commands)

```sh
$ git clone git@github.com:Snapstromegon/EnergyBaseGateway.git
$ cd EnergyBaseGateway
```

### Install dependencies

```sh
$ npm install
```

## Configureing the Gateway

- Copy **config_template.js** to **config.js** and fill in your EnergyBase URL and password.
- Optionally change the port of the webserver (default is 8888)

## Launching the Server

```sh
$ npm start
```

## Using the Gateway

### Example Reponse

```json
{
  "currentUsage": 3712,
  "networkToHouse": 3007,
  "houseToNetwork": 0,
  "solar": 705,
  "ownConsumePercentage": 100
}
```

### Fields explained

| Field                |   Value    | Description                                |
| :------------------- | :--------: | :----------------------------------------- |
| currentUsage         | int (Watt) | Watts your home is currently using         |
| networkToHouse       | int (Watt) | Watts provided by the energy grid          |
| houseToNetwork       | int (Watt) | Watts your home provides to the grid       |
| solar                | int (Watt) | Watts your solar system outputs            |
| ownConsumePercentage | int (Watt) | Percentage of selfuse of your solar output |

## ⚠ Warning

This Gateway has no means of security and answers anyone who asks, so please don't make it accessible from the internet.

Also in its current state it makes a request to the EnergyBase server for each request you make to it.
That way it's a little slower in the response time, but it should be fine.
Don't worry too much about rate limits, as the original api made about one request per second.
