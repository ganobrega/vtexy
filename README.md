# vtexy
A developer framework for a better VTEX Legacy experience. :rocket:

**Vtexy** is a framework on top of poi and JAMstack that make VTEX Legacy developing easy and fun as possible.

## Features
- 📦 Out of box support for JS, CSS, File assets and more.
- ⚛ Framework-agnostic but also support JSX, Vue and more with no configs.
- 🔌 Great extensibility.
- 🐙 Fits most web apps, npm libs.
- 🚨 Great development experience.
- 📡 Sync data with VTEX
- 📴 Offline development
- 💻 Local development


## Usage
`npm i vtexy -D`

Programmatic:
``` javascript
const vtexy = require('vtexy');

vtexy({
  store: process.env.VTEX_SOTRE_NAME,
  production: process.env.NODE_ENV === 'production',
  srcDir: 'src/',
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

## How the tool get the store informations?
All the usage of VTEX API has been required by https://www.npmjs.com/package/vtex.
The usage is the same, but for Legacy version.

## Comming Features
- CMS
  - Placeholder
    - Local Data
    - Import/Export for Production and Local
  - HTML Templates
    - Render local HTML Files
  - Channels
    - Get local configurations for channels

## Todo List
- [ ] Files Manager
  - [ ] Proxy production `.js, .css, images, ...` to local
