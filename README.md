# node-metaverse

> A node.js interface for Second Life.

[![npm version](https://badge.fury.io/js/%40caspertech%2Fnode-metaverse.svg)](https://badge.fury.io/js/%40caspertech%2Fnode-metaverse)
[![Build Status](https://travis-ci.org/CasperTech/node-metaverse.svg?branch=master)](https://travis-ci.org/CasperTech/node-metaverse)
[![Known Vulnerabilities](https://snyk.io/test/npm/@caspertech/node-metaverse/badge.svg)](https://snyk.io/test/npm/@caspertech/node-metaverse)
[![Dependencies](https://david-dm.org/CasperTech/node-metaverse.svg)](https://david-dm.org/CasperTech/node-metaverse.svg)

## Install

```bash
npm install --save @caspertech/node-metaverse
```

## Usage

Javascript

```javascript
const nmv = require('@caspertech/node-metaverse');

const loginParameters     = new nmv.LoginParameters();
loginParameters.firstName = 'firstName';
loginParameters.lastName  = 'lastName';
loginParameters.password  = 'password';
loginParameters.start     = "last";

const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;
const bot     = new nmv.Bot(loginParameters, options);

bot.login().then((response) =>
{
    console.log("Login complete");

    //Establish circuit with region
    return bot.connectToSim();
}).then(() =>
{
    console.log("Connected");
}).catch((error) =>
{
    console.error(error);
});
```

Typescript

```typescript
import { Bot, BotOptionFlags, LoginParameters } from '@caspertech/node-metaverse';

const loginParameters = new LoginParameters();
loginParameters.firstName = 'firstName';
loginParameters.lastName = 'lastName';
loginParameters.password = 'password';
loginParameters.start = 'last';

const options = BotOptionFlags.LiteObjectStore | BotOptionFlags.StoreMyAttachmentsOnly;
const bot = new Bot(loginParameters, options);

bot.login().then((response) =>
{
    console.log("Login complete");

    //Establish circuit with region
    return bot.connectToSim();
}).then(() =>
{
    console.log("Connected");
}).catch((error) =>
{
    console.error(error);
});
```


## License

[MIT](http://vjpr.mit-license.org)
