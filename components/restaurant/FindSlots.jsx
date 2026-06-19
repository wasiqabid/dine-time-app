import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebaseConfig';

const FindSlots = ({
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);

  const handlePress = () => {
    setSlotsVisible(!slotsVisible);
  };
  const handleSlotPress = (slot) => {
    let prevSlot = selectedSlot;
    if (selectedSlot == slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');

    if (userEmail) {
      try {
        await addDoc(collection(db, 'bookings'), {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
        });
        alert('Booking Done Succesfully!');
      } catch (error) {}
    }
  };

  // console.log('Slots Data::', slots ? slots : 'no data for slots');

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          { display: 'flex', padding: 15, justifyContent: 'space-between' },
          { flexDirection: 'row' },
        ]}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: 'red',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handlePress}>
              <Text style={style.findBtn}>Find Slots.</Text>
            </TouchableOpacity>
          </View>
          {selectedSlot != null && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={handleBooking}>
                <Text style={style.bookBtn}>Book Slots.</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {slotsVisible && (
        <View style={[style.ViewBtn]}>
          {slots?.length > 0 &&
            slots?.map((slot, index) => (
              <TouchableOpacity
                style={[
                  style.slotsActiveBtn,
                  {
                    opacity:
                      selectedSlot === null
                        ? 1
                        : selectedSlot === slot
                          ? 1
                          : 0.5,
                  },
                ]}
                key={index}
                onPress={() => handleSlotPress(slot)}
                disabled={
                  selectedSlot == slot || selectedSlot == null ? false : true
                }
              >
                <Text style={{ color: 'black' }}> {slot}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
};

export default FindSlots;
const style = StyleSheet.create({
  findBtn: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 15,
    marginVertical: 10,
    // marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f49b33',
  },

  bookBtn: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f49b33',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  ViewBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginHorizontal: 15,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 30,
    backgroundColor: '#313131',
    borderRadius: 10,
  },
  slotsActiveBtn: {
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#f49b33',
    marginHorizontal: 3,
    marginVertical: 2,
    width: 50,
    height: 30,
    // opacity: '0%',
  },
  // slotsInctiveBtn: {
  //   // justifyContent: 'center',
  //   // borderRadius: 5,
  //   // borderWidth: 1,
  //   // backgroundColor: '#f49b33',
  //   // marginHorizontal: 3,
  //   // marginVertical: 2,
  //   // width: 50,
  //   // height: 30,

  // },
});
