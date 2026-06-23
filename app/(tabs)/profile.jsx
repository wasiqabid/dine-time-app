import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../assets/images/CSS/Colors';

export default function Profile() {
  const auth = getAuth();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };
    fetchEmail();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userEmail');
      setUserEmail(null);

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
    <View style={style.page}>
      <Text style={style.profile}>User Profile</Text>
      {userEmail ? (
        <>
          <Text style={style.emailTxt}>Email:{userEmail}</Text>
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
    </View>
  );
}
const style = StyleSheet.create({
  profile: {
    fontSize: 25,
    color: Colors.Primary,
    fontWeight: 'bold',
    marginBottom: 20,
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
});
