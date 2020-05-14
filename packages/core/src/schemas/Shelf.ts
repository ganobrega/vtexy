import * as yup from 'yup';

export const schema =  yup.object().shape({
  id: yup.string(),
  name: yup.string(),
  cssClass: yup.string()
});

export type Shelf = yup.InferType<typeof schema>;