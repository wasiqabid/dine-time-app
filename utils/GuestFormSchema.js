import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Name is required'),

  phoneNumber: Yup.string()
    .required('Phone number is required.')
    .matches(/^[0-9]+$/, 'phone number must be digits.')
    .min(11, 'phone number must be 11 digits long .'),
});
export default validationSchema;
