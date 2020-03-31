const { array, string, lazy, number, object, boolean, mixed } = require('yup');
const mapValues = require('lodash/mapValues');

const commonPropsOfContent = { name: string().defined(), active: boolean().defined() };

module.exports = object({
  name: string().defined(),
  lid: string().defined(),
  active: boolean().defined(),
  default: boolean().defined(),
  legacy: boolean().defined(),
  bodyClass: string().defined(),
  settings: lazy(placeholders =>
    object(
      mapValues(placeholders, () =>
        array().of(
          object({
            name: string().defined(),
            type: mixed()
              .defined()
              .equals(['html', 'banner', 'collection']),
            content: mixed()
              .when('type', {
                is: 'html',
                then: array().of(
                  object({
                    ...commonPropsOfContent,
                    html: string().defined()
                  })
                )
              })
              .when('type', {
                is: 'banner',
                then: array().of(
                  object({
                    ...commonPropsOfContent,
                    width: number().defined(),
                    height: number().defined(),
                    type: mixed().oneOf(['image', 'flash']),
                    url: string().defined(),
                    file: string().defined()
                  })
                )
              })
              .when('type', {
                is: 'collection',
                then: array().of(
                  object({
                    ...commonPropsOfContent,
                    partner: string().defined(),
                    campaign: string().defined(),
                    category: string().defined(),
                    brand: string().defined(),
                    source: string().defined(),
                    keyword: string().defined(),
                    period: string().defined(),
                    productCluster: number().defined(),
                    queryString: string().defined()
                  })
                )
              }),

            // When type is 'collection'
            layout: mixed().when('type', {
              is: 'collection',
              then: string().defined(),
              otherwise: mixed()
                .nullable()
                .strip()
            }),
            items: mixed().when('type', {
              is: 'collection',
              then: string().defined(),
              otherwise: mixed()
                .nullable()
                .strip()
            }),
            columns: mixed().when('type', {
              is: 'collection',
              then: string().defined(),
              otherwise: mixed()
                .nullable()
                .strip()
            }),
            random: mixed().when('type', {
              is: 'collection',
              then: boolean().defined(),
              otherwise: mixed()
                .nullable()
                .strip()
            }),
            paged: mixed().when('type', {
              is: 'collection',
              then: boolean().defined(),
              otherwise: mixed()
                .nullable()
                .strip()
            }),
            showUnavailable: mixed().when('type', {
              is: 'collection',
              then: boolean().defined(),
              otherwise: mixed()
                .nullable()
                .strip()
            })
          })
        )
      )
    )
  )
});
