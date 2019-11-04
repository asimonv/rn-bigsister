import React from "react";
import styled from "styled-components/native";

const TextWrapper = styled.Text`
  background-color: white;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  overflow: hidden;
  border-width: 1px;
  border-color: #ecf0f1;
`;

const AditionalInfoText = ({ children }) => (
  <TextWrapper>{children}</TextWrapper>
);

export default AditionalInfoText;
