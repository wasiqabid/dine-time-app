import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/images/CSS/Colors';
// import { db } from '../../config/firebaseConfig';

import DatePickerComponent from '../../components/restaurant/DatePickerComponent';
import { db } from '../../config/firebaseConfig';
export default function Restaurant() {
  const [date, setDate] = useState(new Date());

  const { restaurant } = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;

  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const handleLocation = async () => {
    const url = 'https://maps.app.goo.gl/bvccxt9NYnJT6DyA6';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("can't open link!", url);
    }
  };
  const handleNextImage = () => {
    const carouselLength = carouselData.images.length;
    if (currentIndex < carouselLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }

    if (currentIndex == carouselLength - 1) {
      const nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };
  const handlePrevImage = () => {
    const carouselLength = carouselData.images.length;
    if (currentIndex > 0) {
      // const prevIndex = currentIndex - 1;
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
    if (currentIndex == 0) {
      const prevIndex = carouselLength - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };
  const carouselItem = ({ item }) => {
    return (
      <View
        style={{
          width: windowWidth - 3,
          height: 200,
          // borderCurve: 'circular',
          borderRadius: 25,
          // position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: '50%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            right: '9%',
          }}
        >
          <Ionicons
            onPress={handleNextImage}
            name='arrow-forward'
            size={24}
            color='white'
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: '50%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            left: '3%',
          }}
        >
          <Ionicons
            onPress={handlePrevImage}
            name='arrow-back'
            size={24}
            color='white'
          />
        </View>
        <View
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            left: '50%',
            transform: [{ translateX: -50 }],
            zIndex: 10,
            bottom: 15,
            flexDirection: 'row',
          }}
        >
          {carouselData.images?.map((_, i) => (
            <View
              key={i}
              style={[
                {
                  backgroundColor: 'white',
                  height: 4,
                  width: 4,
                  borderRadius: '100%',
                  marginHorizontal: 2,
                },
                i === currentIndex && {
                  height: 7,
                  width: 7,
                },
              ]}
            />
          ))}
        </View>
        <Image
          source={{ uri: item }}
          style={{
            resizeMode: 'cover',
            height: '100%',
            width: '90%',
            opacity: 0.5,
            backgroundColor: 'black',
            marginRight: 20,
            marginLeft: 5,
            borderRadius: 35,
          }}
        />
      </View>
    );
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
        <View
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            marginHorizontal: 15,
            marginVertical: 15,
            // borderCurve: 'circular',
            borderRadius: 25,
          }}
        >
          <FlatList
            ref={flatListRef}
            data={carouselData.images}
            renderItem={carouselItem}
            horizontal
            scrollEnabled={false}
            style={{ borderRadius: 25 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

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
        <View style={{ flex: 1, flexDirection: 'row' }}>
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
      </ScrollView>
    </SafeAreaView>
  );
}
