import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../assets/images/CSS/Colors';

export default function profile() {
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    const fetchEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };
    fetchEmail();
  }, []);

  return (
    <View style={style.page}>
      <Text>profile</Text>
      {userEmail ? <Text style={style.emailTxt}>Emai:{userEmail}</Text> : <></>}
    </View>
  );
}
const style = StyleSheet.create({
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
});
