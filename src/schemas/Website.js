const yup = require('yup');

module.exports = yup.object({
  id: yup.string(),
  name: yup.string(),
  parent: yup.string(),
  mobile: yup.string(),
  tablet: yup.string(),
  links: yup.array().of(
    yup.object({
      id: yup.string(),
      hostname: yup.string(),
      salesChannel: yup.string()
    })
  )
  // dictionary: yup.array().of(
  //   object({
  //     host: yup.string(),
  //     key: yup.string(),
  //     value: yup.string()
  //   })
  // )
});
