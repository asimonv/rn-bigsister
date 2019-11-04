import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import Button from "./Button";
import ButtonText from "./ButtonText";

const GetSpotifyRecommendationsContainer = styled.View`
  margin: 10px 0px;
  display: flex;
`;

const spotifyMessage =
  "Now that I have analyzed your identity, it's time to show you the songs that I think you might like according to the information you provided";

const GetSpotifyRecommendations = ({ onPress }) => {
  return (
    <GetSpotifyRecommendationsContainer>
      <Text style={{ marginBottom: 20 }}>{spotifyMessage}</Text>

      <Button success onPress={onPress}>
        <ButtonText primary>Get Spotify recommendations</ButtonText>
      </Button>
    </GetSpotifyRecommendationsContainer>
  );
};

GetSpotifyRecommendations.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default GetSpotifyRecommendations;
