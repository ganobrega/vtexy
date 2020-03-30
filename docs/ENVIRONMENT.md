# Environment

While VTEXY is running, the packages behind him use environment variables declared by top of VTEXY.

This is a SCHEMA for all packages.

## Scope

### VTEX

- `VTEX_ACCOUNT`: Account of the store.
- `VTEX_TOKENID`: Cookie to use in **API requests** like **Catalog** and **Checkout**. The used cookie is: `VtexIdclientAutCookie` 

### VTEXY

- `VTEXY_CONFIG`: The path of config file.
- `VTEXY_BASEDIR`: The root path of the project that contains DATA and CONTENT folders.
- `VTEXY_DATA`: The path of datas.
- `VTEXY_CONTENT`: The path of contents (e.g: Template, Shelves, Arquivos, Files).
- `VTEXY_LOCALE`: The user interface locale.

## Usage

The usage is too simple.

Check the code above:

```javascript
// packages/vtex-new-plugin/index.js

console.log(process.env.VTEX_ACCOUNT); // Output: my-store

console.log(process.env.VTEXY_DATA); // Output: /path/to/my-store-web/data
console.log(process.env.VTEXY_CONTENT); // Output: /path/to/my-store-web/dist
```

For more datails, type: `console.log(process.env)` on your plugin main file and check all **VTEX** and **VTEXY** **prefixes**.
