import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

const DatePickerComponent = ({ date, setDate }) => {
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const handlePress = () => {
    setShow(true);
  };
  return (
    <View style={{ flexDirection: 'row', alignSelf: 'right' }}>
      <TouchableOpacity onPress={handlePress}>
        {Platform.OS === 'android' && (
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              padding: 15,
              backgroundColor: '#313131',
              marginLeft: 15,
              borderRadius: 15,
              marginRight: 15,
            }}
          >
            {date.toLocaleDateString()}
          </Text>
        )}
        {Platform.OS === 'android' && show && (
          <DateTimePicker
            accentColor='#f49b33'
            color='#f49b33'
            value={date}
            mode='date'
            onChange={onChange}
            display='default'
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        )}
        {Platform.OS === 'ios' && (
          <DateTimePicker
            accentColor='#f49b33'
            color='#f49b33'
            onChange={onChange}
            value={date}
            mode='date'
            display='default'
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DatePickerComponent;
