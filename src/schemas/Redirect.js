const yup = require('yup');

const requiredAbsolutePathUrl = value => ~value.indexOf('/');

module.exports = yup.array().of(
  yup.object({
    from: yup.string().test('absolute-path', requiredAbsolutePathUrl),
    to: yup.string().test('absolute-path', requiredAbsolutePathUrl),
    startDate: yup.string(),
    endDate: yup.string(),
    active: yup.boolean()
  })
);
