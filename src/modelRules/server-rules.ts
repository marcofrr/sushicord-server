import * as yup from 'yup';
export const createServerRules = yup.object().shape({
  name: yup.string().required(),
});
