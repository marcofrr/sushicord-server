import * as yup from 'yup';
import * as bcrypt from 'bcrypt';
import User from '../models/user-model';

export const loginRules = yup.object().shape({
  email: yup
    .string()
    .email('Has to be a valid email!')
    .required('This field is required!'),
  password: yup
    .string()
    .trim()
    .required()
    .min(6, 'Password is too short')
    .matches(
      /[a-zA-Z0-9@!#%]/,
      'Password can only contain Latin letters, numbers and/or [@, !, #, %].'
    )
    .when('email', (email: string, schema: any) =>
      schema.test({
        test: async (password: string) => {
          const user = await User.findOne({email});
          const valid = await bcrypt.compare(password, user!.password);
          return valid;
        },
        message: 'Invalid Password!!AQUI',
      })
    ),
});

export const signUpRules = yup.object().shape({
  email: yup
    .string()
    .email('Has to be a valid email!')
    .required('This field is required!')
    .test('uniqueEmail', 'This Email already exists!', async (email: any) => {
      const user = await User.findOne({email});
      return !user;
    }),
  userName: yup.string().trim().required(),
  password: yup
    .string()
    .trim()
    .required()
    .min(6, 'Password is too short')
    .matches(
      /[a-zA-Z0-9@!#%]/,
      'Password can only contain Latin letters, numbers and/or [@, !, #, %].'
    ),
  birthDate: yup.string().required(),
});
