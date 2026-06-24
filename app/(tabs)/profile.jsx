import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../assets/images/CSS/Colors';
import Frame from '../../assets/images/Frame.png';
import dinetimelogo from '../../assets/images/dinetimelogo.png';

export default function Profile() {
  const auth = getAuth();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userNumber, setUserNumber] = useState(null);
  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };

    const fetchName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name);
    };

    const fetchNumber = async () => {
      const number = await AsyncStorage.getItem('userNumber');
      setUserNumber(number);
    };

    fetchEmail();
    fetchName();
    fetchNumber();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('number');

      setUserEmail(null);
      setUserName(null);
      setUserNumber(null);

      Alert.alert('Logged Out!', 'You have been logged out successfully.');
      router.push('/signin');
    } catch (error) {
      Alert.alert('Log Error', 'Error while logging out');
    }
  };
  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#1b1818',
        // height: '100%',
        paddingBottom: 30,
        justifyContent: 'space-between',
      }}
    >
      <View style={style.page}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={dinetimelogo}
            style={{ width: 230, height: 150, alignSelf: 'center' }}
          />
        </View>
        <Text style={style.profile}>User Profile</Text>
        {userEmail ? (
          <>
            <View
              style={{
                borderWidth: 2,
                borderColor: Colors.Primary,
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
            >
              <View style={style.view}>
                <Text style={style.emailTxt}>Name: {userName}</Text>
              </View>
              <View style={style.view}>
                <Text style={style.emailTxt}>Email: {userEmail}</Text>
              </View>
              <View style={style.view}>
                <Text style={style.emailTxt}>Phone Number: {userNumber}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogout} style={style.btnSubmit}>
              <Text style={style.btnTxt}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={handleSignup} style={style.btnSubmit}>
              <Text style={style.btnTxt}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ alignItems: 'center' }}>
          <Image
            source={Frame}
            style={{ height: 300, width: 300, resizeMode: 'contain' }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
const style = StyleSheet.create({
  profile: {
    fontSize: 25,
    color: Colors.Primary,
    fontWeight: 'bold',
    marginBottom: 20,
    // textDecorationLine: 'underline',
    // textDecorationStyle: 'solid',
    borderColor: Colors.Primary,
    borderBottomWidth: 3,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Secondary,
  },
  emailTxt: {
    color: 'white',
    fontSize: 15,
    marginBottom: 6,
  },
  btnSubmit: {
    backgroundColor: '#f49b33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b1818',
  },
  view: {
    borderWidth: 1,
    borderColor: Colors.Primary,
    padding: 5,
    borderRadius: 5,
    margin: 10,
  },
});
