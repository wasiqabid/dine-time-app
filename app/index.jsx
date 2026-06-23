import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '../assets/images/CSS/Colors';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dinetimelogo from '../assets/images/dinetimelogo.png';
import Frame from '../assets/images/Frame.png';

// const entryImg = require('../assets/images/Frame.png');

export default function Index() {
  const router = useRouter();
  const handleGuest = async () => {
    await AsyncStorage.setItem('isGuest', 'true');
    router.push('/home');
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#1b1818', flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            paddingHorizontal: '50',
            backgroundColor: '#1b1818',
            // height: '100%',
          }}
        >
          <Image source={dinetimelogo} style={{ width: 300, height: 300 }} />
          <View
            style={{
              //flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              style={style.btnSignup}
            >
              <Text style={style.Signuptxt}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGuest} style={style.btnGuest}>
              <Text style={style.Guesttxt}>Guest User</Text>
            </TouchableOpacity>
          </View>
          <View style={style.Linetxt}>
            <View style={style.line} />
            <Text style={{ marginHorizontal: 10, color: Colors.Primary }}>
              or
            </Text>
            <View style={style.line} />
          </View>
          <View style={style.Usertxt}>
            <Text style={style.Usertxt}>Already a User?</Text>
            <TouchableOpacity
              style={{ paddingTop: 20 }}
              onPress={() => router.push('/signin')}
            >
              <Text style={style.btnSignin}> Sign In</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Image
              source={Frame}
              style={{ width: 300, height: 300, resizeMode: 'contain' }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  btnSignup: {
    backgroundColor: '#f49b33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  Signuptxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b1818',
  },
  btnGuest: {
    backgroundColor: '#1b1818',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#f49b33',
    borderWidth: 2,
  },
  Guesttxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f49b33',
  },

  Linetxt: {
    color: '#fff',
    marginVertical: 20,
    // paddingTop: 20,
    border: 10,
    // borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: 'red',
    alignItems: 'center',
  },

  line: {
    borderBottomWidth: 2,
    borderColor: '#f49b33',
    width: 100,
    marginBottom: 1,
    // padding: 2,
    alignContent: 'center',
  },
  Usertxt: {
    paddingTop: 20,
    color: '#fff',
    fontWeight: 'semi-bold',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  btnSignin: {
    // paddingTop: 20,
    color: '#f49b33',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
