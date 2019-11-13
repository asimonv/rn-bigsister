import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Button from "./Button";
import ButtonText from "./ButtonText";

const GetSpotifyRecommendationsContainer = styled.View`
  margin: 10px 0px;
  display: flex;
`;

const GetSpotifyRecommendations = ({ onPress }) => {
  const { t } = useTranslation();
  const spotifyMessage = t("spotify.message");
  return (
    <GetSpotifyRecommendationsContainer>
      <Text style={{ marginBottom: 20 }}>{spotifyMessage}</Text>

      <Button success onPress={onPress}>
        <ButtonText primary>{t("spotify.button")}</ButtonText>
      </Button>
    </GetSpotifyRecommendationsContainer>
  );
};

GetSpotifyRecommendations.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default GetSpotifyRecommendations;
