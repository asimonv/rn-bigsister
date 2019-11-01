import React from 'react';
import { View } from 'react-native';

const MessageBubble = ({ style, children }) => (
  <View
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      width: 'auto',
      alignSelf: 'stretch',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      ...style,
    }}
  >
    {children}
  </View>
);

export default MessageBubble;
