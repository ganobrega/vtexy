const yup = require('yup');

module.exports = yup.object().shape({
  id: yup.string(),
  name: yup.string(),
  cssClass: yup.string()
});
