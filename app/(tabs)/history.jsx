import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../assets/images/CSS/Colors';
import dinetimelogo from '../../assets/images/dinetimelogo.png';

const history = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    };
    fetchUserEmail();
  }, []);
  const fetchBookings = async () => {
    if (userEmail) {
      try {
        const bookingCollection = collection(db, 'bookings');
        const bookingQuery = query(
          bookingCollection,
          where('email', '==', userEmail),
        );
        const bookingSnapshot = await getDocs(bookingQuery);
        const bookingList = bookingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingList);
        console.log('data is here', bookingList, bookingSnapshot);
      } catch (error) {
        Alert.alert('could not fetch bookings');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [userEmail]);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          style.safeView,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: 'white', fontSize: 24 }}>Loading...</Text>
      </SafeAreaView>
    );
  }
  const handleSignin = () => {
    router.push('/signin');
  };

  return (
    <SafeAreaView style={style.safeView}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={dinetimelogo}
          style={{ width: 230, height: 150, alignSelf: 'center' }}
        />
      </View>
      <View style={{ flex: 1, marginVertical: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={style.heading}>User History</Text>
        </View>
        {userEmail ? (
          <FlatList
            data={bookings}
            onRefresh={fetchBookings}
            refreshing={loading}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={style.flatList}>
                <Text style={style.historyTxt}>Date: {item.date}</Text>
                <Text style={style.historyTxt}>Guests: {item.guests}</Text>
                <Text style={style.historyTxt}>Slot: {item.slot}</Text>
                <Text style={style.historyTxt}>
                  Restaurantestaurant: {item.restaurant}
                </Text>
                <Text style={style.historyTxt}>Email: {item.email}</Text>
              </View>
            )}
          />
        ) : (
          // <Text style={{ color: 'white', fontSize: 24 }}>Data is here.</Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={style.guestTxt}>
              Please Sign in to see user history.
            </Text>
            <TouchableOpacity onPress={handleSignin} style={style.btnSubmit}>
              <Text style={style.btnTxt}>Sign in</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* <View style={{ alignItems: 'center' }}>
          <Image
            source={Frame}
            style={{ height: 300, width: 300, resizeMode: 'contain' }}
          />
        </View> */}
    </SafeAreaView>
  );
};

export default history;

const style = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.Secondary,
  },

  flatList: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.Primary,
    marginVertical: 10,
    marginHorizontal: 10,
    // marginTop: 30,
  },

  historyTxt: {
    color: 'white',
    fontSize: 15,
    paddingHorizontal: 5,
  },
  heading: {
    color: Colors.Primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },

  guestTxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'semi-bold',
    marginBottom: 5,
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
