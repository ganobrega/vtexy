# Command Line Interface

## Introduction

Currently VTEXY works only with the CLI.
If you want to use the module that starts the server you will have to inspect how the CLI works on [repository](https://github.com/ganobrega/vtexy).

## Installation

To install VTEXY as global, run the follow command:

```
$ npm i -g vtexy
```

To Install it local, use:

```
$ npm i vtexy -D
```

```
$ yarn add vtexy -D
```

## Commands

### start

This feature will boot a VTEX server.

```
$ vtexy start
```

If you do not enter the account flag the program will automatically look for a [configuration files](#configurations) in the directory where the process is being executed.

| Flag             | Description       |
| ---------------- | ----------------- |
| `--acount, -a`   | VTEX account name |
| `--base-dir, -d` | Base directory    |

### init

Comming soon

## Configurations

The configuration file is used for persistence. Thus, the user only needs to use the command without having to enter the account path and directory flags.

[Cosmiconfig]() is used to find a configuration on the directory.

#### Paths

- `package.json` [Check example](#example-for-packagejson)
- `.vtexyrc` [Check example](#example-for-vtexyrc)
- `.vtexyrc.json`
- `.vtexyrc.yaml`
- `.vtexyrc.yml`
- `.vtexyrc.js`
- `vtexy.config.js`
- `vtexy.json`

#### Scope

**type:** `Object`

| Property | Type    | Description               |
| -------- | ------- | ------------------------- |
| account  | string  | VTEX account name         |
| baseDir  | string  | Base directory            |
| noSSR    | boolean | Disable SSR               |
| port     | number  | Changes the listened port |

#### Example for package.json

```json
{
  "name": "awesome-store",
  "version": "1.0.0",
  "vtexy": {
    "account": "awesomestore",
    "baseDir": "./"
  }
}
```

#### Example for .vtexyrc

```json
{
  "account": "awesomestore",
  "baseDir": "./"
}
```

<!-- ## Sync -->

<!-- ## Commands

### start

### init

### sync -->
