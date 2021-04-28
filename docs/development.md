# Folder structure

The follow **tree** shows the main folders that **VTEXY** sees.

```text
.
├── data
├── static
└── templates
```

## Data

This structure is based on VTEX's CMS.

On folders we always have JSON files, that the currently supported extension is `jsonc`.

First, the data structure folder looks like this:

```text
data
├── sites
  ├── My Store
    ├── _.jsonc
    └── routes
      ├── Busca
      ├── Produto
      ├── _.jsonc
      └── Home.jsonc
  ├── My Store Mobile
├── shelves
└── redirects.jsonc
```

- `sites/` as well as `Sites and Channels` on CMS.

  Within the `sites/` directory we have subdirectories that play the role of Website.
  In the `[website]/` directory we have the abstraction of the website concept in the CMS, that is, we have a file for the **settings** (`_.jsonc`) and a folder for the **Layouts** (`routes/`).

- `routes/` has the same concept as in the CMS. Inside we have folders that become the URL paths and inside each **Folder** we have **Layouts** and a configuration file `_.jsonc` for **Folder Settings**.

For each file check the schema in [Data](?id=data).

> **Let's talk about underscores as filenames**
>
> Well, i dont like the idea to use **_underscores_** as filename. But, in the case of abstraction of properties hierarchly, we want to give you an idea that the file is for the configuration of the `folder` or `website` that is at the same hierarchical level.
> Maybe this can be discussed in the future.

> **Why not save these datas on a database**
>
> Integrations with database like _MongoDB_ or _Mysql_ will be considered in the futures

We call `data` all the information that needs to be saved, as in a database.
The data will be used to feed the templates.

Check the concept of Data in [Concept](/references/concept.md) there the purpose is explained.

### Website

**type:** `Object`

Website files are located on path: `data/sites/[...]/_.jsonc`

**Required filename**: `_.jsonc`

| Property | Type                                   | Values | Default |
| -------- | -------------------------------------- | ------ | ------- |
| id       | string                                 |        |         |
| name     | string                                 |        |         |
| parent   | string                                 |        |         |
| mobile   | string                                 |        |         |
| tablet   | string                                 |        |         |
| links    | array<[WebsiteLink](?id=websitelink)\> |        |         |

#### WebsiteLink

**type:** `Object`

| Property     | Type   | Values | Default |
| ------------ | ------ | ------ | ------- |
| id           | string |        |         |
| hostname     | string |        |         |
| salesChannel | string |        |         |

<!-- id: string(),
  name: string(),
  parent: string(),
  mobile: string(),
  tablet: string(),
  links: array().of(
    object({
      id: string(),
      hostname: string(),
      salesChannel: string()
    })
  ) -->

### Folder

**type:** `Object`

| Property               | Type    | Values                              | Default |
| ---------------------- | ------- | ----------------------------------- | ------- |
| name                   | string  |                                     |         |
| marketingContext       | string  |                                     |         |
| searchContext          | string  |                                     |         |
| protocol               | string  | http \| https \| both               |         |
| cacheType              | string  | no-cache \| local \| remote \| both |         |
| authenticationRequired | boolean |                                     | true    |

### Layout

**type:** `Object`

| Property  | Type                                                                        | Values | Default |
| --------- | --------------------------------------------------------------------------- | ------ | ------- |
| name      | string                                                                      |        |         |
| lid       | string                                                                      |        |         |
| active    | boolean                                                                     |        |         |
| default   | boolean                                                                     |        |         |
| legacy    | boolean                                                                     |        |         |
| bodyClass | string                                                                      |        |         |
| settings  | object<{[key: string], [value: array<[LayoutSetting](#layoutsetting)\> ]}\> |        |         |

#### LayoutSetting

**type:** `Object`

| Property        | Type                                                     | Values                       | Default | Special for types |
| --------------- | -------------------------------------------------------- | ---------------------------- | ------- | ----------------- |
| name            | string                                                   |                              |         |                   |
| type            | string                                                   | html \| banner \| collection |         |                   |
| content         | array<[LayoutSettingContent](?id=layoutsettingcontent)\> |                              |         |                   |
| layout          | string                                                   |                              |         | collection        |
| items           | string                                                   |                              |         | collection        |
| columns         | string                                                   |                              |         | collection        |
| random          | boolean                                                  |                              |         | collection        |
| paged           | boolean                                                  |                              |         | collection        |
| showUnavailable | boolean                                                  |                              |         | collection        |

#### LayoutSettingContent

**type:** `Object`

> The follow objects will depend by the type of the [LayoutSetting](?id=layoutsetting), on `type` property.

##### **For `html`**

| Property | Type    | Values | Default |
| -------- | ------- | ------ | ------- |
| name     | string  |        |         |
| active   | boolean |        |         |
| html     | string  |        |         |

##### **For `banner`**

| Property | Type    | Values         | Default |
| -------- | ------- | -------------- | ------- |
| name     | string  |                |         |
| active   | boolean |                |         |
| width    | number  |                |         |
| height   | number  |                |         |
| type     | string  | image \| flash |         |
| url      | string  |                |         |
| file     | string  |                |         |

##### **For `collection`**

| Property       | Type    | Values | Default |
| -------------- | ------- | ------ | ------- |
| name           | string  |        |         |
| active         | boolean |        |         |
| partner        | string  |        |         |
| campaign       | string  |        |         |
| category       | string  |        |         |
| brand          | string  |        |         |
| source         | string  |        |         |
| keyword        | string  |        |         |
| period         | string  |        |         |
| productCluster | number  |        |         |
| queryString    | string  |        |         |

### Redirect

**type:** `array<RedirectLink>`

#### RedirectLink

**type:** `Object`

| Property  | Type    | Values | Default |
| --------- | ------- | ------ | ------- |
| name      | string  |        |         |
| from      | string  |        |         |
| to        | string  |        |         |
| startDate | string  |        |         |
| endDate   | string  |        |         |
| active    | boolean |        |         |

### Shelf

**type:** `Object`

| Property | Type   | Values | Default |
| -------- | ------ | ------ | ------- |
| id       | string |        |         |
| name     | string |        |         |
| cssClass | string |        |         |

## Static

The `static` directory is used to serve static files.
The files can be acessed by `/static`.

Example: `https://awesomestore.vtexlocal.com.br:3000/static`.

Supported extensions : `.js`, `.css`, `.png`, `.jpg`, `.gif`

## Templates

### Pages

Comming soon

### Shelves

Shelves are **Template Engines** based on [Velocity Template Engine](https://velocity.apache.org/engine/2.2/user-guide.html) and fed with data by a collection.

### Subtemplates

Comming soon

### Custom Elements

Comming soon
