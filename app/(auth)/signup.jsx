import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/images/CSS/Colors';
import dinetimelogo from '../../assets/images/dinetimelogo.png';
import Frame from '../../assets/images/Frame.png';
import validationSchema from '../../utils/authSchema';

const Signup = () => {
  const handleGuest = async () => {
    await AsyncStorage.setItem('isGuest', 'true');
    router.push('/home');
  };
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (values) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredentials.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: values.email,
        createdAt: new Date(),
        name: values.name,
        number: values.number,
      });
      await AsyncStorage.setItem('userEmail', values.email);
      await AsyncStorage.setItem('userName', values.name);
      await AsyncStorage.setItem('userNumber', values.number);

      await AsyncStorage.setItem('isGuest', 'false');
      router.push('/home');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Sign Up failed!',
          'already signed up with this email. Please use a different email',
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert(
          'Sign Up failed!',
          'Error while signing up. Please try later.',
          [{ text: 'OK' }],
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#1b1818', flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: '#1b1818',
          // height: '100%',
          paddingBottom: 30,
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            paddingHorizontal: '50',
            backgroundColor: '#1b1818',
            // height: '100%',
            gap: 10,
          }}
        >
          <Image
            source={dinetimelogo}
            style={{ width: 230, height: 150, alignSelf: 'center' }}
          />

          <Text
            style={{
              paddingTop: 60,
              paddingBottom: 10,
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            Let's get you started
          </Text>
          <Formik
            initialValues={{
              name: '',
              number: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              <View>
                <Text style={style.valueTxt}>Full Name</Text>
                <TextInput
                  style={[style.inputTxt, isLoading && style.disabledInput]}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  editable={!isLoading}
                />
                {touched.name && errors.name && (
                  <Text style={{ color: 'red' }}>{errors.name}</Text>
                )}
                <Text style={style.valueTxt}>Email</Text>
                <TextInput
                  style={[style.inputTxt, isLoading && style.disabledInput]}
                  keyboardType='email-address'
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  editable={!isLoading}
                />
                {touched.email && errors.email && (
                  <Text style={{ color: 'red' }}>{errors.email}</Text>
                )}
                <Text style={style.valueTxt}>Password</Text>
                <TextInput
                  style={[style.inputTxt, isLoading && style.disabledInput]}
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  editable={!isLoading}
                />
                {touched.password && errors.password && (
                  <Text style={{ color: 'red' }}>{errors.password}</Text>
                )}
                <Text style={style.valueTxt}>Confirm Password</Text>
                <TextInput
                  style={[style.inputTxt, isLoading && style.disabledInput]}
                  secureTextEntry
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  editable={!isLoading}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>
                )}
                <Text style={style.valueTxt}>Phone Number</Text>
                <TextInput
                  style={[style.inputTxt, isLoading && style.disabledInput]}
                  onChangeText={handleChange('number')}
                  onBlur={handleBlur('number')}
                  value={values.number}
                  editable={!isLoading}
                />
                {touched.number && errors.number && (
                  <Text style={{ color: 'red' }}>{errors.number}</Text>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[style.btnSignup, isLoading && style.disabledbtn]}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.Primary} />
                  ) : (
                    <Text style={style.Signuptxt}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <View style={style.Usertxt}>
            <Text style={style.Usertxt}>Already a User?</Text>
            <TouchableOpacity
              style={{ paddingTop: 20 }}
              onPress={() => router.push('/signin')}
            >
              <Text style={style.btnRoute}> Sign In</Text>
            </TouchableOpacity>
          </View>
          <View style={style.Linetxt}>
            <View style={style.line} /> <Text style={style.Linetxt}>or</Text>
            <View style={style.line} />
          </View>
          <View style={style.Usertxt}>
            <Text style={style.Usertxt}>Be a </Text>
            <TouchableOpacity style={{ paddingTop: 20 }} onPress={handleGuest}>
              <Text style={style.btnRoute}>Guest User</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={Frame}
            style={{ height: 300, width: 300, resizeMode: 'contain' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  btnSignup: {
    backgroundColor: '#f49b33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  Signuptxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b1818',
  },

  inputTxt: {
    backgroundColor: '#1b1818',
    color: '#ffffff',
    borderColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    // alignItems: 'center',
    borderWidth: 2,
    paddingBottom: 10,
    paddingTop: 10,
  },

  valueTxt: {
    color: '#f49b33',
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
  },
  Usertxt: {
    paddingTop: 20,
    color: '#fff',
    fontWeight: 'semi-bold',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  btnRoute: {
    // paddingTop: 20,
    paddingLeft: 5,
    color: '#f49b33',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  Linetxt: {
    color: '#fff',
    paddingTop: 20,
    fontWeight: 'semi-bold',
    border: 10,
    // borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  Linetxt: {
    color: '#fff',
    paddingTop: 20,
    fontWeight: 'semi-bold',
    border: 10,
    // borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  line: {
    borderBottomWidth: 2,
    borderColor: '#f49b33',
    width: 100,
    marginBottom: 1,
    // padding: 2,
    alignContent: 'center',
  },
  disabledbtn: {
    backgroundColor: ' rgba(244, 155, 51, 0.15)',
    // color: 'black',
  },
  disabledInput: {
    backgroundColor: 'rgba(163, 163, 163, 0.25)',
    color: '#999999',
  },
});

export default Signup;
