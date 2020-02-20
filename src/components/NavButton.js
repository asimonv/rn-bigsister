import React from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";

const size = 30;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props =>
    props.backgroundColor || "rgba(255, 255, 255, 0.5)"};
  border-radius: ${size / 2};
  width: ${size};
  height: ${size};
`;

const NavButton = ({ onPress, style, name, ...props }) => (
  <ButtonContainer {...props} style={{ ...style }} onPress={onPress}>
    <Icon
      style={{ alignSelf: "center", textAlign: "center", ...style }}
      name={Platform.OS === "ios" ? `ios-${name}` : `md-${name}`}
      size={size}
    />
  </ButtonContainer>
);

export default NavButton;
