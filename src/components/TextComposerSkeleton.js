import React from "react";
import styled from "styled-components";
import Button from "./Button";
import ButtonText from "./ButtonText";

const ContentWrapper = styled.View`
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: yellow;
  border-radius: 10px;
`;

const TextInputWrapper = styled.View`
  background-color: white;
  text-align: center;
  font-size: 17px;
  max-height: 350px;
`;

const StyledTextInput = styled.TextInput`
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  align-self: stretch;
`;

const ButtonsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;

const TextComposerSkeleton = ({
  onChangeText,
  placeholder,
  onPressCancel,
  onPressSend,
  leftButtonText,
  rightButtonText
}) => {
  return (
    <ContentWrapper>
      <TextInputWrapper>
        <StyledTextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          textAlign="center"
          multiline
        />
      </TextInputWrapper>
      <ButtonsWrapper>
        <Button style={{ flex: 1, marginRight: 5 }} onPress={onPressCancel}>
          <ButtonText>{leftButtonText}</ButtonText>
        </Button>
        <Button style={{ flex: 1 }} onPress={onPressSend}>
          <ButtonText>{rightButtonText}</ButtonText>
        </Button>
      </ButtonsWrapper>
    </ContentWrapper>
  );
};

export default TextComposerSkeleton;
