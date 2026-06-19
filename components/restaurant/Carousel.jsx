import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, View } from 'react-native';

export default function Carousel({ images = [] }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  const handleNextImage = () => {
    const carouselLength = images.length;
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
    const carouselLength = images.length;
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
          {images?.map((_, i) => (
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
  return (
    <View>
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
          data={images}
          renderItem={carouselItem}
          horizontal
          scrollEnabled={false}
          style={{ borderRadius: 25 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
