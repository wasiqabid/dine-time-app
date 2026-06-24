import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
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
import validationSchema from '../../utils/SigninSchema';
// import validationSchema from '../../utils/authSchema';

const Signin = () => {
  const router = useRouter();
  const handleGuest = async () => {
    await AsyncStorage.setItem('isGuest', 'true');
    router.push('/home');
  };

  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore();
  const auth = getAuth();
  const handleSignin = async (values) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredentials.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('User data.', userDoc.data());
        await AsyncStorage.setItem('userEmail', values.email);
        await AsyncStorage.setItem('userName', data.name);
        await AsyncStorage.setItem('userNumber', data.number);
        await AsyncStorage.setItem('isGuest', 'false');

        router.push('/home');
      } else {
        console.log('no such document.');
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Sign In failed!', 'Incorrect password. please try again', [
          { text: 'OK' },
        ]);
      } else {
        Alert.alert(
          'Sign in failed!',
          'Error while signing in. Please try later.',
          [{ text: 'OK' }],
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  // const router = useRouter();
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
            Sign in Here
          </Text>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSignin}
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
                <Text style={style.valueTxt}>Email</Text>
                <TextInput
                  style={[style.imputTxt, isLoading && style.disabledInput]}
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
                  style={[style.imputTxt, isLoading && style.disabledInput]}
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  editable={!isLoading}
                />
                {touched.password && errors.password && (
                  <Text style={{ color: 'red' }}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[style.btnSignin, isLoading && style.disabledbtn]}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.Primary} />
                  ) : (
                    <Text style={style.Signintxt}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <View style={style.Usertxt}>
            <Text style={style.Usertxt}>New User?</Text>
            <TouchableOpacity
              style={{ paddingTop: 20 }}
              onPress={() => router.push('/signup')}
            >
              <Text style={style.btnRoute}>Sign Up</Text>
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

export default Signin;

const style = StyleSheet.create({
  btnSignin: {
    backgroundColor: '#f49b33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  Signintxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b1818',
  },

  imputTxt: {
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
  line: {
    borderBottomWidth: 2,
    borderColor: '#f49b33',
    width: 100,
    marginBottom: 1,
    // padding: 2,
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
  disabledbtn: {
    backgroundColor: ' rgba(244, 155, 51, 0.15)',
    // color: 'black',
  },
  disabledInput: {
    backgroundColor: 'rgba(163, 163, 163, 0.25)',
    color: '#999999',
  },
});
