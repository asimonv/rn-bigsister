import React from "react";
import styled from "styled-components/native";

const ButtonContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  background-color: ${props => {
    if (props.primary) {
      return "#0984e3";
    }
    if (props.success) {
      return "#2ed573";
    }
    if (props.danger) {
      return "red";
    }
    return "white";
  }};
  border-radius: 5px;
  border-width: 2px;
  border-color: black;
  width: auto;
`;

const Button = ({ onPress, style, children, ...props }) => (
  <ButtonContainer {...props} style={{ ...style }} onPress={onPress}>
    {children}
  </ButtonContainer>
);

export default Button;
