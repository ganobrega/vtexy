import * as yup from 'yup';

const requiredAbsolutePathUrl = value => ~value.indexOf('/');

export const schema =  yup.array().of(
  yup.object({
    from: yup.string().test('absolute-path', requiredAbsolutePathUrl),
    to: yup.string().test('absolute-path', requiredAbsolutePathUrl),
    startDate: yup.string(),
    endDate: yup.string(),
    active: yup.boolean()
  })
);

export type Redirects = yup.InferType<typeof schema>;