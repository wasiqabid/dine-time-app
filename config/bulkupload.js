import { collection, doc, setDoc } from 'firebase/firestore';
import { carouselImages, restaurants, slots } from '../store/restaurants';
import { db } from './firebaseConfig';

// const restaurantData = slots;

const uploadRestaurants = async () => {
  try {
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      restaurant.id = `restaurant_${i + 1}`;
      const docRef = doc(collection(db, 'restaurants'), restaurant.id);
      await setDoc(docRef, restaurant);
    }
  } catch (e) {
    console.error(e);
  }
};

const uploadSlots = async () => {
  try {
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const docRef = doc(collection(db, 'slots'), `slot_${i + 1}`);
      await setDoc(docRef, slot);
    }
  } catch (e) {
    console.error(e);
  }
};

const uploadCarouselImages = async () => {
  try {
    for (let i = 0; i < carouselImages.length; i++) {
      const carouselImage = carouselImages[i];
      const docRef = doc(collection(db, 'carousels'), `carousel_${i + 1}`);
      await setDoc(docRef, carouselImage);
    }
  } catch (e) {
    console.error(e);
  }
};


export { uploadCarouselImages, uploadRestaurants, uploadSlots };
