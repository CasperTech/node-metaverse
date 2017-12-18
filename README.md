# node-metaverse

> A node.js interface for Second Life.

[![npm version](https://badge.fury.io/js/%40caspertech%2Fnode-metaverse.svg)](https://badge.fury.io/js/%40caspertech%2Fnode-metaverse)
[![Build Status](https://travis-ci.org/CasperTech/node-metaverse.svg?branch=master)](https://travis-ci.org/CasperTech/node-metaverse)
[![NSP Status](https://nodesecurity.io/orgs/caspertech-ltd/projects/7628bddf-1138-402b-b4d4-2c6353a55266/badge)](https://nodesecurity.io/orgs/caspertech-ltd/projects/7628bddf-1138-402b-b4d4-2c6353a55266)
[![Node version](https://img.shields.io/node/v/@caspertech/node-metaverse.svg?style=flat)](http://nodejs.org/download/)

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
import {Bot, BotOptionFlags, LoginParameters} from '@caspertech/node-metaverse';

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
