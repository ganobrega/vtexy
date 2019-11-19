## VTEXY with Gatsby
VTEXY has support for everything, read the concept at [README.md](../readme.md)
## Getting Started

To getting started with Gatsby run the following commands:
``` bash
yarn global add gatsby
gatsby new my-awesome-site
```

Lets check the structure folder:
```
- my-awesome-site/
-- src/
-- gatsby-browser.js
-- gatsby-config.js
-- package.json
```

Lets install VTEXY:
`yarn add vtexy`

Add the file `vtexy.config.js` with the following content:
``` javascript
// vtexy.config.js
require('dotenv').config();

module.exports = {
  store: process.env.VTEX_SOTRE_NAME,
  production: process.env.NODE_ENV === 'production',
  publicDir: 'public/',
  // data: 'vtexy/' # default
}
```
