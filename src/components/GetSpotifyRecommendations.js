import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import Button from '../components/Button';
import ButtonText from '../components/ButtonText';
import MessageBubble from '../components/MessageBubble';
import BubbleText from '../components/BubbleText';
import PropTypes from 'prop-types';

const GetSpotifyRecommendationsContainer = styled.View`
  margin: 10px 0px;
  display: flex;
`;

const spotifyMessage =
  "Now that I have analyzed your identity, it's time to show you the songs that I think you might like according to the information you provided";

const GetSpotifyRecommendations = ({ onPress }) => {
  return (
    <GetSpotifyRecommendationsContainer>
      <View style={{ width: '100%', height: 100 }}>
        <LottieView
          source={require('../assets/animations/4031-voice-recognition.json')}
          autoPlay
          loop
          style={{ flex: 1 }}
        />
      </View>
      <MessageBubble style={{ marginBottom: 20 }}>
        <BubbleText title={spotifyMessage} />
      </MessageBubble>
      <Button success onPress={onPress}>
        <ButtonText primary>Get Spotify recommendations</ButtonText>
      </Button>
    </GetSpotifyRecommendationsContainer>
  );
};

GetSpotifyRecommendations.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default GetSpotifyRecommendations;
