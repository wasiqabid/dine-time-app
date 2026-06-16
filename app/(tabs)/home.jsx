import { BlurView } from 'expo-blur';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/images/CSS/Colors';
import dinetimelogo from '../../assets/images/dinetimelogo.png';
import banner from '../../assets/images/homeBanner.png';
import {
  uploadCarouselImages,
  uploadRestaurants,
  uploadSlots,
} from '../../config/bulkupload';
// import { restaurants } from '../../store/restaurants';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
// import { db } from '../../config/firebaseConfig';
import { useRouter } from 'expo-router';

import { db } from '../../config/firebaseConfig';
const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    uploadRestaurants();
    uploadSlots();
    uploadCarouselImages();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/restaurant/${item.name}`)}
      // onPress={() => router.push(`/restaurant/${item.address}`)}
      style={{
        backgroundColor: Colors.dark.icon,
        height: 190,
        width: 220,
        justifyContent: 'center',
        padding: 8,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
      }}
    >
      <Image
        resizeMode='cover'
        source={{ uri: item.image }}
        style={{ height: 70, marginTop: 2, marginBottom: 1 }}
      />
      <Text
        style={{
          color: '#f49b33',
          fontWeight: 'bold',
          marginBottom: 2,
          fontSize: 17,
        }}
      >
        {item.name}
      </Text>
      <Text style={{ color: 'white', fontSize: 12, marginBottom: 2 }}>
        {item.address}
      </Text>
      <Text style={{ color: 'white', fontSize: 12, marginBottom: 2 }}>
        Open: {item.opening} - CLose: {item.closing}
      </Text>
    </TouchableOpacity>
  );

  const getRestaurants = async () => {
    const q = query(collection(db, 'restaurants'));
    const res = await getDocs(q);

    res.forEach((item) => {
      setRestaurants((prev) => [...prev, item.data()]);
    });
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#111', flex: 1 }}>
      <View
        style={{
          textAlign: 'center',
          alignItems: 'center',
          marginBottom: 15,
          paddingTop: 10,
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: '#333',
            width: '90%',
            height: 45,
            justifyContent: 'center',
            borderRadius: 20,
            flexDirection: 'row',
          }}
        >
          <Image
            style={{ height: 40, width: 100 }}
            resizeMode='cover'
            source={dinetimelogo}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          resizeMode='cover'
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // width: '100%',
            height: 400,
            width: '100%',
            backgroundColor: '#1b1818',
          }}
          source={banner}
        >
          <BlurView
            intensity={Platform.OS === 'android' ? 90 : 25}
            tint='dark'
            // style={{ alignSelf: 'center' }}
          >
            <Text
              style={{
                // textAlign: 'center',
                fontSize: 35,
                color: 'white',
                // alignItems: 'center',
                // alignContent: 'center',
                alignSelf: 'center',
              }}
            >
              Dine with me
            </Text>
          </BlurView>
        </ImageBackground>
        <Text style={style.text}>Special Discounts %</Text>
        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating color={Colors.Primary} />
        )}

        <Text style={style.text}>Our Restaurants</Text>
        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={{ padding: 16 }}
            initialNumToRender={5}
          />
        ) : (
          <ActivityIndicator animating color={Colors.Primary} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const style = StyleSheet.create({
  text: {
    fontSize: 25,
    color: Colors.Primary,
    fontWeight: 'bold',
    marginTop: 10,
    // marginBottom: 5,
    marginHorizontal: 20,
  },
});
