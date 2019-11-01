import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const renderIonicon = ({ name, size, focused }) => (
  <Ionicons
    name={name}
    size={size}
    color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
  />
);

export default renderIonicon;
