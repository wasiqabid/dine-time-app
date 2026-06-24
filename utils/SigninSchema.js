import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('invalid email'),
  password: Yup.string()
    .required('password is required')
    .min(6, 'password must be at least 6 characters.'),
});
export default validationSchema;
