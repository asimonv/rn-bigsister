import React from "react";
import Modal from "react-native-modal";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-navigation";

import ButtonText from "./ButtonText";
import Colors from "../constants/Colors";

const NextButton = styled.TouchableOpacity`
  margin: 15px 0;
  padding: 10px;
  background-color: ${Colors.tabIconDefault};
  border-radius: 5px;
`;

const ModalText = styled.Text`
  font-size: 16px;
`;

const ModalTitle = styled.Text`
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const ModalHelper = ({
  isVisible,
  modalTitle,
  modalText,
  index,
  setVisible
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isVisible={isVisible}
      hasBackdrop={false}
      swipeDirection={["down"]}
      style={{
        justifyContent: "flex-end",
        margin: 0
      }}
    >
      <SafeAreaView
        style={{
          padding: 15,
          backgroundColor: "white",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10
        }}
      >
        {modalTitle && <ModalTitle>{modalTitle}</ModalTitle>}
        <ModalText>{modalText}</ModalText>
        <NextButton onPress={() => setVisible(index)}>
          <ButtonText>{t("next")}</ButtonText>
        </NextButton>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalHelper;
