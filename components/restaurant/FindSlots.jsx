import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../assets/images/CSS/Colors';
import { db } from '../../config/firebaseConfig';
import validationSchema from '../../utils/GuestFormSchema';

const FindSlots = ({
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

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
    const guestStatus = await AsyncStorage.getItem('isGuest');

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
      } catch (error) {
        console.log(error);
      }
    } else if (guestStatus === 'true') {
      setModalVisible(true);
      setFormVisible(true);
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleFormSubmit = async (values) => {
    try {
      await addDoc(collection(db, 'bookings'), {
        ...values,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant: restaurant,
      });
      alert('Booking Done Succesfully!');
      setModalVisible(false);
    } catch (error) {
      console.log(error);
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
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        style={style.modal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000080',
            justifyContent: 'flex-end',
          }}
        >
          <View style={style.formView}>
            {formVisible && (
              <Formik
                initialValues={{ fullName: '', phoneNumber: '' }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  values,
                  touched,
                  errors,
                }) => (
                  <View>
                    <View>
                      <Ionicons
                        name='close-circle'
                        size={30}
                        color={Colors.Primary}
                        onPress={handleCloseModal}
                      />
                    </View>
                    <Text style={style.valueTxt}>Name</Text>
                    <TextInput
                      style={style.imputTxt}
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      value={values.fullName}
                    />
                    {touched.fullName && errors.fullName && (
                      <Text style={{ color: 'red' }}>{errors.fullName}</Text>
                    )}
                    <Text style={style.valueTxt}>Phome Number</Text>
                    <TextInput
                      style={style.imputTxt}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      value={values.phoneNumber}
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text style={{ color: 'red' }}>{errors.phoneNumber}</Text>
                    )}
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={style.btnSubmit}
                    >
                      <Text style={style.Submittxt}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
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

  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imputTxt: {
    backgroundColor: '#313131',
    color: '#ffffff',
    borderColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    // alignItems: 'center',
    borderWidth: 2,
    paddingBottom: 10,
    paddingTop: 10,
  },
  btnSubmit: {
    backgroundColor: '#f49b33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  valueTxt: {
    color: '#f49b33',
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
  },
  Submittxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b1818',
  },

  formView: {
    backgroundColor: '#313131',
    marginHorizontal: 4,
    borderRadius: 25,
    padding: 4,
    paddingBottom: 6,
  },
});
