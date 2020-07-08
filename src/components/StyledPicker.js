import React from "react";
import { StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const StyledPicker = ({ placeholder, onValueChange, data }) => {
  return (
    <RNPickerSelect
      placeholder={{
        label: placeholder,
        value: null,
      }}
      style={{
        placeholder: {
          color: "black",
        },
        inputIOS: styles.inputIOS,
        inputAndroid: styles.inputAndroid,
      }}
      onValueChange={value => onValueChange(value)}
      items={data}
    />
  );
};

const styles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "white",
    fontWeight: "800",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    textAlign: "center",
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    textAlign: "center",
    color: "black",
    fontWeight: "800",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default StyledPicker;
