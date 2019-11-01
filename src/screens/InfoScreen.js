import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
//import LottieView from 'lottie-react-native';
import { getUserRecommendations } from '../services/spotify';
import Button from '../components/Button';
import ButtonText from '../components/ButtonText';
import MessageBubble from '../components/MessageBubble';

const spotifyMessage =
  "Now that I have analyzed your identity, it's time to show you the songs that I think you might like according to the information you provided";

class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this._onPressSpotify = this._onPressSpotify.bind(this);
  }

  async _onPressSpotify() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const filters = navigation.getParam('filters');
    const info = navigation.getParam('info');
    const limit = 50;
    const recommendations = await getUserRecommendations({ ...filters, limit });
    navigate('screen1', { recommendations, info, filters });

    /* const { navigation } = this.props;
    const { navigate } = navigation;
    const filters = navigation.getParam('filters');
    const info = navigation.getParam('info');
    const limit = 50;

    // spotify not initialized
    if (!(await Spotify.isInitializedAsync())) {
      console.log('spotify not initialized');
      const spotifyOptions = {
        clientID: Config.SPOTIFY_CLIENTID,
        sessionUserDefaultsKey: 'SpotifySession',
        redirectURL: Config.SPOTIFY_REDIRECT_URI,
        scopes: [
          'user-read-private',
          'playlist-read',
          'playlist-read-private',
          'playlist-modify-public',
        ],
      };
      await Spotify.initialize(spotifyOptions);
    }

    // spotify logged in?
    if (await Spotify.isLoggedInAsync()) {
      console.log('user is logged in Spotify');
      const recommendations = await Spotify.sendRequest(
        'v1/recommendations',
        'GET',
        { ...filters, limit },
        false
      );
      navigate('screen1', { recommendations, info, filters });
    } else {
      console.log('trying to login spotify');
      if (await Spotify.login()) {
        const recommendations = await Spotify.sendRequest(
          'v1/recommendations',
          'GET',
          { ...filters, limit },
          false
        );
        navigate('screen1', { recommendations, info, filters });
      }
    } */
  }

  render() {
    const { navigation } = this.props;
    const info = navigation.getParam('info');
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#BA55D3' }}
        forceInset={{ top: 'never' }}
      >
        <ScrollView style={{ flex: 1 }}>
          <MessageBubble style={{ margin: 20 }}>
            <Text style={styles.bubbleText}>{spotifyMessage}</Text>
          </MessageBubble>
          <Button
            success
            style={{ marginHorizontal: 20 }}
            onPress={this._onPressSpotify}
          >
            <ButtonText primary>Get Spotify recommendations</ButtonText>
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  bubbleText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rebeccapurple',
    textAlign: 'center',
    padding: 5,
  },
});

export default InfoScreen;
