import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Linking, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/images/CSS/Colors';
// import { db } from '../../config/firebaseConfig';

import Carousel from '../../components/restaurant/Carousel';
import DatePickerComponent from '../../components/restaurant/DatePickerComponent';
import FindSlots from '../../components/restaurant/FindSlots';
import GuestPickerComponent from '../../components/restaurant/GuestPickerComponent';
import { db } from '../../config/firebaseConfig';
export default function Restaurant() {
  const [date, setDate] = useState(new Date());

  const { restaurant } = useLocalSearchParams();

  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const handleLocation = async () => {
    const url = 'https://maps.app.goo.gl/bvccxt9NYnJT6DyA6';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("can't open link!", url);
    }
  };

  const getRestaurantData = async () => {
    try {
      console.log('Restaurant, Restaurant Query: ', restaurant);
      const restaurantQuery = query(
        collection(db, 'restaurants'),
        where('name', '==', restaurant),
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log('Restaurant, No matching restaurant found');
        return;
      }

      for (const doc of restaurantSnapshot.docs) {
        const restaurantObj = doc.data();
        setRestaurantData(restaurantObj);

        const slotsQuery = query(
          collection(db, 'slots'),
          where('res_id', '==', restaurantObj.id),
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        if (slotsSnapshot.empty) {
          console.log('Restaurant, No matching slots found');
          return;
        }
        console.log('Slots snapshots::', slotsSnapshot);
        slotsSnapshot.forEach((slotDoc) => {
          console.log('Slots snapshots:: slotDoc', slotDoc);

          setSlotsData(slotDoc.data());
        });

        const carouselQuery = query(
          collection(db, 'carousels'),
          where('res_id', '==', restaurantObj.id),
        );
        const carouselSnapshot = await getDocs(carouselQuery);
        if (carouselSnapshot.empty) {
          console.log('No matching carousel found');
          return;
        }
        carouselSnapshot.forEach((carouselDoc) => {
          setCarouselData(carouselDoc.data());
        });
      }
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  console.log('Restaurant, Restaurant data: ', restaurantData);
  console.log('Restaurant, Slot data: ', slotsData?.slot);
  console.log('Restaurant, Carousel Data: ', carouselData);
  // console.log(restaurantData, slotsData, carouselData);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: Colors.Secondary },
        { flex: 1 },
        Platform.OS === 'android' && { paddingBottom: 15 },
        Platform.OS === 'ios' && { paddingBottom: 25 },
        { paddingTop: 15 },
      ]}
    >
      <ScrollView>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: Colors.Primary,
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{ color: Colors.Primary, fontSize: 15, fontWeight: 'bold' }}
          >
            {restaurant}
          </Text>
        </View>
        <Carousel images={carouselData.images || []} />

        <View
          style={{ flex: 1, flexDirection: 'row', marginTop: 2, padding: 15 }}
        >
          <Ionicons name='location-sharp' size={24} color={Colors.Primary} />
          <Text style={{ maxWidth: '75%', color: 'white', fontSize: 14 }}>
            {restaurantData.address} |{'   '}
            <Text
              onPress={handleLocation}
              style={{
                color: '#f49b33',
                fontSize: 15,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                fontStyle: 'italic',
              }}
            >
              Get Directions
            </Text>
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', padding: 15 }}>
          <Ionicons name='time' size={20} color={Colors.Primary} />
          <Text
            style={{
              maxWidth: '75%',
              color: 'white',
              fontSize: 14,
              paddingLeft: 5,
              marginTop: 2,
              fontWeight: 'bold',
            }}
          >
            {restaurantData.opening} - {restaurantData.closing}
          </Text>
        </View>
        <View
          style={{
            borderColor: '#f49b33',
            borderRadius: 10,
            borderWidth: 2,
            padding: 10,
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 15,
                alignContent: 'right',
              }}
            >
              <Ionicons name='calendar' size={20} color={Colors.Primary} />
              <Text style={{ color: 'white', marginHorizontal: 15 }}>
                Select Booking Date
              </Text>
            </View>
            <DatePickerComponent date={date} setDate={setDate} />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              // padding: 15,
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderColor: '#313131',
              borderWidth: 2,
              backgroundColor: '#313131',
              marginTop: 10,
              marginHorizontal: 10,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                // padding: 15,
                alignContent: 'right',
                marginTop: 20,
              }}
            >
              <Ionicons name='people' size={20} color={Colors.Primary} />
              <Text style={{ color: 'white', marginHorizontal: 15 }}>
                Select number of guests.
              </Text>
            </View>
            <GuestPickerComponent
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {slotsData && (
            <FindSlots
              restaurant={restaurant}
              date={date}
              selectedNumber={selectedNumber}
              slots={slotsData.slot}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
