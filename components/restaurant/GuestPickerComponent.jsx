import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GuestPickerComponent = ({ selectedNumber, setSelectedNumber }) => {
  const decrement = () => {
    if (selectedNumber > 1) setSelectedNumber(selectedNumber - 1);
  };
  const increment = () => {
    if (selectedNumber < 8) setSelectedNumber(selectedNumber + 1);
  };
  return (
    <View style={style.component}>
      <TouchableOpacity onPress={decrement} style={{ borderEndEndRadius: 5 }}>
        <Text style={style.btnStyle}>-</Text>
      </TouchableOpacity>
      <Text style={style.btnTxt}>{selectedNumber}</Text>
      <TouchableOpacity onPress={increment} style={{ borderEndEndRadius: 5 }}>
        <Text style={style.btnStyle}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuestPickerComponent;
const style = StyleSheet.create({
  component: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  btnStyle: {
    color: 'white',
    backgroundColor: '##313131',
    fontSize: 12,
    fontWeight: 'bold',
    borderColor: '#f49b33',
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  btnTxt: {
    color: 'white',
    fontSize: 14,
    backgroundColor: '#313131',
    paddingHorizontal: 10,
  },
});
