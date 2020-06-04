# Data

We call `data` all the information that needs to be saved, as in a database.
The data will be used to feed the templates.

Check the concept of Data in [Concept](/references/concept.md) there the purpose is explained.

## Website

**type:** `Object`

Website files are located on path: `data/sites/[...]/_.jsonc`

**Required filename**: `_.jsonc`

| Property | Type                                | Values | Default |
| -------- | ----------------------------------- | ------ | ------- |
| id       | string                              |        |         |
| name     | string                              |        |         |
| parent   | string                              |        |         |
| mobile   | string                              |        |         |
| tablet   | string                              |        |         |
| links    | array<[WebsiteLink](#websitelink)\> |        |         |

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

## Folder

**type:** `Object`

| Property               | Type    | Values                              | Default |
| ---------------------- | ------- | ----------------------------------- | ------- |
| name                   | string  |                                     |         |
| marketingContext       | string  |                                     |         |
| searchContext          | string  |                                     |         |
| protocol               | string  | http \| https \| both               |         |
| cacheType              | string  | no-cache \| local \| remote \| both |         |
| authenticationRequired | boolean |                                     | true    |

## Layout

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

| Property        | Type                                                  | Values                       | Default | Special for types |
| --------------- | ----------------------------------------------------- | ---------------------------- | ------- | ----------------- |
| name            | string                                                |                              |         |                   |
| type            | string                                                | html \| banner \| collection |         |                   |
| content         | array<[LayoutSettingContent](#layoutsettingcontent)\> |                              |         |                   |
| layout          | string                                                |                              |         | collection        |
| items           | string                                                |                              |         | collection        |
| columns         | string                                                |                              |         | collection        |
| random          | boolean                                               |                              |         | collection        |
| paged           | boolean                                               |                              |         | collection        |
| showUnavailable | boolean                                               |                              |         | collection        |

#### LayoutSettingContent

**type:** `Object`

> The follow objects will depend by the type of the [LayoutSetting](#layoutsetting), on `type` property.

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

## Redirect

**type:** `array<RedirectLink>`

### RedirectLink

**type:** `Object`

| Property  | Type    | Values | Default |
| --------- | ------- | ------ | ------- |
| name      | string  |        |         |
| from      | string  |        |         |
| to        | string  |        |         |
| startDate | string  |        |         |
| endDate   | string  |        |         |
| active    | boolean |        |         |

## Shelf

**type:** `Object`

| Property | Type   | Values | Default |
| -------- | ------ | ------ | ------- |
| id       | string |        |         |
| name     | string |        |         |
| cssClass | string |        |         |
