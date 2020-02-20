import styled from "styled-components/native";

const ButtonText = styled.Text`
  text-transform: uppercase;
  text-align: center;
  font-weight: 800;
  color: ${props => {
    if (props.primary || props.success || props.danger) {
      return "white";
    }
    return "black";
  }};
`;

export default ButtonText;
