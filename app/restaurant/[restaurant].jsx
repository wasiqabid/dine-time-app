import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/images/CSS/Colors';
// import { db } from '../../config/firebaseConfig';

import { db } from '../../config/firebaseConfig';
export default function Restaurant() {
  const { restaurant } = useLocalSearchParams();

  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});

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
        slotsSnapshot.forEach((slotDoc) => {
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
  console.log('Restaurant, Slot data: ', slotsData);
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
            borderBottomWidth: 4,
            borderColor: Colors.Primary,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ color: Colors.Primary, fontSize: 15 }}>
            {restaurant}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
