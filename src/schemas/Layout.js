const yup = require('yup');
const mapValues = require('lodash/mapValues');

const commonPropsOfContent = { name: yup.string(), active: yup.boolean() };

module.exports = yup.object({
  name: yup.string(),
  lid: yup.string(),
  active: yup.boolean(),
  default: yup.boolean(),
  legacy: yup.boolean(),
  bodyClass: yup.string(),
  settings: yup.lazy(placeholders =>
    yup.object(
      mapValues(placeholders, () =>
        yup.array().of(
          yup.object({
            name: yup.string(),
            type: yup.mixed().equals(['html', 'banner', 'collection']),
            content: yup
              .mixed()
              .when('type', {
                is: 'html',
                then: yup.array().of(
                  yup.object({
                    ...commonPropsOfContent,
                    contents: yup.array().of(
                      yup.object({
                        ...commonPropsOfContent,
                        partner: yup.string(),
                        campaign: yup.string(),
                        category: yup.string(),
                        brand: yup.string(),
                        source: yup.string(),
                        keyword: yup.string(),
                        period: yup.string(),
                        html: yup.string(),
                        files: yup.string()
                      })
                    )
                  })
                )
              })
              .when('type', {
                is: 'banner',
                then: yup.array().of(
                  yup.object({
                    ...commonPropsOfContent,
                    width: yup.number(),
                    height: yup.number(),
                    type: yup.mixed().oneOf(['image', 'flash']),
                    url: yup.string(),
                    file: yup.string()
                  })
                )
              })
              .when('type', {
                is: 'collection',
                then: yup.array().of(
                  yup.object({
                    ...commonPropsOfContent,
                    partner: yup.string(),
                    campaign: yup.string(),
                    category: yup.string(),
                    brand: yup.string(),
                    source: yup.string(),
                    keyword: yup.string(),
                    period: yup.string(),
                    productCluster: yup.number(),
                    queryString: yup.string()
                  })
                )
              }),

            // When type is 'collection'
            layout: yup.mixed().when('type', {
              is: 'collection',
              then: yup.string(),
              otherwise: yup
                .mixed()
                .nullable()
                .strip()
            }),
            items: yup.mixed().when('type', {
              is: 'collection',
              then: yup.string(),
              otherwise: yup
                .mixed()
                .nullable()
                .strip()
            }),
            columns: yup.mixed().when('type', {
              is: 'collection',
              then: yup.string(),
              otherwise: yup
                .mixed()
                .nullable()
                .strip()
            }),
            random: yup.mixed().when('type', {
              is: 'collection',
              then: yup.boolean(),
              otherwise: yup
                .mixed()
                .nullable()
                .strip()
            }),
            paged: yup.mixed().when('type', {
              is: 'collection',
              then: yup.boolean(),
              otherwise: yup
                .mixed()
                .nullable()
                .strip()
            }),
            showUnavailable: yup.mixed().when('type', {
              is: 'collection',
              then: yup.boolean(),
              otherwise: yup
                .mixed()
                .nullable()
                .strip()
            })
          })
        )
      )
    )
  )
});
