import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('invalid email'),
  password: Yup.string()
    .required('password is required')
    .min(6, 'password must be at least 6 characters.'),
  name: Yup.string().required('Full name is required'),
  number: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'number must be digits')
    .min(11, 'Number must be only 11 digits.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'passwords must match.')
    .required('please confirm your password'),
});
export default validationSchema;
