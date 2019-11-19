# VTEXY 
A developer framework for a better VTEX Legacy experience. :rocket:

**Vtexy** is a framework that make VTEX Legacy developing easy and fun as possible.

## Features
- 📴 Offline development
- 💻 Local development
- 📡 Sync data with VTEX
- ✉️  Better development experience with marketing e-mails


## Usage

`npm i vtexy -D`

Enviroment:
```
//.env

VTEX_API_KEY=<your-api-app-key-here>
VTEX_API_TOKEN=<your-api-app-token-here>
```


Programmatic:
``` javascript
// index.js

require('dotenv').config();

const vtexy = require('vtexy');

vtexy({
  store: process.env.VTEX_SOTRE_NAME,
  production: process.env.NODE_ENV === 'production',
  publicDir: 'public/'
})
```

CLI:
``` bash
vtexy dev -f vtexy.config.js
```

## Why Vtexy?
VTEX is deprecating the Legacy version, then this tool is to support all Developers to make a great Job in VTEX.

`VTEX + Legacy = Vtexy`

## What this tool do?
This tool make a local verison of your Store, getting all information of your commerce and making a local API.
`vtexy start`

## And after? How i publish all the content to the Production?
The tool gives you a CLI command to publish
`vtexy publish`

> Note: This command only publish the CMS Content, not all the store.
For publish all store use `--force` flag.

## How the tool get the store informations?
All the usage of VTEX API has been required by https://www.npmjs.com/package/vtex.
The usage is the same, but for Legacy version.

<!--## Comming Features
- CMS
  - Placeholder
    - Local Data
    - Import/Export for Production and Local
  - HTML Templates
    - Render local HTML Files
  - Channels
    - Get local configurations for channels
-->

<!--## Todo List
- [ ] Files Manager
  - [ ] Proxy production `.js, .css, images, ...` to local -->
