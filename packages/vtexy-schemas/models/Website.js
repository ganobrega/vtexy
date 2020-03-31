const { array, string, object } = require('yup');

module.exports = object({
  id: string().defined(),
  name: string().defined(),
  parent: string(),
  mobile: string(),
  links: array().of(
    object({
      id: string().defined(),
      hostname: string().defined(),
      salesChannel: string().defined()
    })
  )
  // dictionary: array().of(
  //   object({
  //     host: string().defined(),
  //     key: string().defined(),
  //     value: string().defined()
  //   })
  // )
});
