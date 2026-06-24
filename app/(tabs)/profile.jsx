import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../assets/images/CSS/Colors';
import Frame from '../../assets/images/Frame.png';
import dinetimelogo from '../../assets/images/dinetimelogo.png';

export default function Profile() {
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userNumber, setUserNumber] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSaveChanges = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No user logged in.');
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        name: userName,
        number: userNumber,
      });

      await AsyncStorage.setItem('userName', userName);
      await AsyncStorage.setItem('userEmail', userEmail);
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {}
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('number');
      await AsyncStorage.removeItem('isGuest');

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
                width: '85%',
                marginBottom: 10,
              }}
            >
              <View style={style.view}>
                <Text style={style.LabelTxt}>Name:</Text>
                {isEditing ? (
                  <TextInput
                    style={style.input}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder='Enter Name'
                    placeholderTextColor='#666'
                    autoCapitalize='words'
                  />
                ) : (
                  <Text style={style.LabelTxt}>{userName}</Text>
                )}
              </View>
              <View style={style.view}>
                <Text style={style.LabelTxt}>Email:</Text>
                {isEditing ? (
                  <TextInput
                    style={style.input}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    placeholder='Enter email'
                    keyboardType='email-address'
                    placeholderTextColor='#666'
                    autoCapitalize='words'
                    editable={!isEditing}
                  />
                ) : (
                  <Text style={style.LabelTxt}>{userEmail}</Text>
                )}
              </View>
              <View style={style.view}>
                <Text style={style.LabelTxt}>Phone Number:</Text>
                {isEditing ? (
                  <TextInput
                    style={style.input}
                    value={userNumber}
                    onChangeText={setUserNumber}
                    placeholder='Enter Number'
                    keyboardType='phone-pad'
                    placeholderTextColor='#666'
                  />
                ) : (
                  <Text style={style.LabelTxt}>{userNumber}</Text>
                )}
              </View>
            </View>

            <View style={style.actionBtns}>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    style={style.btnSubmit}
                    onPress={handleSaveChanges}
                  >
                    <Text style={style.btnTxt}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[style.btnSubmit, { backgroundColor: '#666' }]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={[style.btnTxt, { color: 'white' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={style.btnSubmit}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={style.btnTxt}>Edit Profile</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={handleLogout} style={style.btnSubmit}>
              <Text style={style.btnTxt}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={style.btnSubmit} onPress={handleSignup}>
              <Text style={style.btnTxt}>Sign Up</Text>
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
  LabelTxt: {
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
  input: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f49b33',
  },

  actionBtns: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
});
