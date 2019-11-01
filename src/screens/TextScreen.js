import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Transition } from 'react-navigation-fluid-transitions';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//  import LottieView from 'lottie-react-native';
import moment from 'moment';

import TextComposer from '../components/TextComposer';
import MessageBubble from '../components/MessageBubble';
import NavButton from '../components/NavButton';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import ButtonText from '../components/ButtonText';

import pInsights from '../services/watson';
import { fetchLikes } from '../services/facebook';
import fetchTweets from '../services/twitter';
import textCategories from '../services/options';
import genres from '../data/genre-seeds';

const RECOMMENDED_CHARS = 280;
const viewTint = '#c0392b';

const saveTest = async (test, source) => {
  const history = JSON.parse(await AsyncStorage.getItem('@LittleStore:history')) || [];
  const newHistory = [...history, { ...test, date: new Date(), source }];
  await AsyncStorage.setItem('@LittleStore:history', JSON.stringify(newHistory));
};

const sourcesNames = {
  tw: 'Twitter',
  fb: 'Facebook',
  text: 'Text',
};

class TextScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      status: false,
      finished: false,
      gettingResults: false,
      gettingCategories: true,
      categories: null,
      randomCategory: null,
      error: false,
      filters: { energy: 0.2, min_popularity: 50, seed_genres: ['chill'], max_valence: 0.2 },
    };
    this._onPressSend = this._onPressSend.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this._onPressInfo = this._onPressInfo.bind(this);
    this._toggleInfo = this._toggleInfo.bind(this);
    this._getInfoMessage = this._getInfoMessage.bind(this);
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const context = navigation.getParam('context');
    switch (context) {
      case 'fb':
        this.setState({ gettingResults: true, testStatus: 'Getting your Facebook posts' });
        try {
          const posts = await fetchLikes();
          const content = posts.data.map(p => ({
            content: p.message,
            contenttype: 'text/plain',
            id: p.id,
            language: 'en',
          }));
          if (content.length) {
            this.setState({ testStatus: 'Getting Watson data', content: posts });
            const res = await pInsights({ contentItems: content });
            this.setState(prev => ({
              finished: !prev.finished,
              gettingResults: !prev.gettingResults,
              error: res.code && res.code !== 200,
              testStatus: res.code && res.code !== 200 ? res.message : undefined,
            }));

            if (!res.code) {
              const musicPreferences = res.consumption_preferences.find(
                cp => cp.consumption_preference_category_id === 'consumption_preferences_music'
              );
              const preferredGenres = musicPreferences.consumption_preferences.filter(
                c => c.score > 0
              );
              const reqGenres = preferredGenres
                .map(pg => {
                  const splittedPref = pg.consumption_preference_id.split('_');
                  return splittedPref[splittedPref.length - 1];
                })
                .filter(g => genres.includes(g));
              this.setState(
                {
                  filters: { seed_genres: reqGenres },
                  info: res,
                  testStatus: undefined,
                },
                async () => {
                  //  save test
                  await saveTest(this.state, context);
                  console.log('now must fetch songs');
                }
              );
            }
          } else {
            this.setState(prev => ({
              finished: !prev.finished,
              error: true,
              testStatus: "I'm sorry, but there's not enough data to analyse.",
            }));
          }
        } catch (e) {
          console.log(e);
        }
        break;
      case 'tw':
        this.setState({ gettingResults: true, testStatus: 'Getting your tweets' });
        try {
          const userId = await AsyncStorage.getItem('@LittleStore:twitterId');
          const tweets = await fetchTweets(userId);
          const content = tweets.data.map(tw => ({
            content: tw.text,
            contenttype: 'text/plain',
            id: `${tw.id}`,
            language: 'en',
          }));
          console.log(tweets);
          if (content.length) {
            this.setState({ testStatus: 'Getting Watson data', content: tweets });
            const res = await pInsights({ contentItems: content });
            this.setState(prev => ({
              finished: !prev.finished,
              gettingResults: !prev.gettingResults,
              error: res.code && res.code !== 200,
              testStatus: res.code && res.code !== 200 ? res.message : undefined,
            }));

            if (!res.code) {
              const musicPreferences = res.consumption_preferences.find(
                cp => cp.consumption_preference_category_id === 'consumption_preferences_music'
              );
              const preferredGenres = musicPreferences.consumption_preferences.filter(
                c => c.score > 0
              );
              const reqGenres = preferredGenres
                .map(pg => {
                  const splittedPref = pg.consumption_preference_id.split('_');
                  return splittedPref[splittedPref.length - 1];
                })
                .filter(g => genres.includes(g));
              this.setState(
                {
                  filters: { seed_genres: reqGenres },
                  info: res,
                  testStatus: undefined,
                },
                async () => {
                  //  this.animation.play();
                  console.log('now must fetch songs');
                  //  save test
                  await saveTest(this.state, context);
                }
              );
            }
          } else {
            this.setState(prev => ({
              finished: !prev.finished,
              error: true,
              testStatus: "I'm sorry, but there's not enough data to analyse.",
            }));
          }
        } catch (e) {
          console.log(e);
        }
        break;
      default:
        try {
          this.setState({ gettingResults: true, testStatus: 'Getting categories' });
          const categories = await textCategories();
          const { data } = categories;
          const randomCategory = data[Math.floor(Math.random() * data.length)];
          this.setState({
            categories,
            gettingResults: false,
            gettingCategories: false,
            testStatus: undefined,
            randomCategory,
          });
        } catch (e) {
          console.log(e);
        }
        break;
    }
  }

  _changeRandomCategory = () => {
    const {
      categories: { data },
    } = this.state;
    const randomCategory = data[Math.floor(Math.random() * data.length)];
    this.setState({ randomCategory });
  };

  _onPressSend() {
    this.setState(
      prev => ({ gettingResults: !prev.gettingResults, testStatus: 'Getting Watson data' }),
      async () => {
        try {
          const { text } = this.state;
          const {
            navigation: { navigate },
          } = this.props;
          const res = await pInsights({ text });
          this.setState(prev => ({
            finished: !prev.finished,
            gettingResults: !prev.gettingResults,
            error: res.code && res.code !== 200,
            testStatus: res.code && res.code !== 200 ? res.message : undefined,
          }));

          if (!res.code) {
            const musicPreferences = res.consumption_preferences.find(
              cp => cp.consumption_preference_category_id === 'consumption_preferences_music'
            );
            const preferredGenres = musicPreferences.consumption_preferences.filter(
              c => c.score > 0
            );
            const reqGenres = preferredGenres
              .map(pg => {
                const splittedPref = pg.consumption_preference_id.split('_');
                return splittedPref[splittedPref.length - 1];
              })
              .filter(g => genres.includes(g));
            this.setState(
              {
                filters: { seed_genres: reqGenres },
                info: res,
              },
              async () => {
                //  this.animation.play();
                await saveTest(this.state, 'text');
                console.log('now must fetch songs');
              }
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  _getInfoMessage() {
    const { navigation } = this.props;
    const context = navigation.getParam('context');
    switch (context) {
      case 'fb':
        return 'Little Sister uses the Facebook Graph API + the Watson Personality Traits API to show you information about yourself';
      case 'tw':
        return 'Little Sister uses the Twitter API + the Watson Personality Traits API to show you information about yourself';
      default:
        return 'Little Sister will give your information about yourself using the Watson Personality Traits API based on the text you entered';
    }
  }

  _onPressCancel() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  _onPressInfo() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const now = moment().format('MMMM Do YYYY, h:mm:ssA');
    const context = navigation.getParam('context');
    navigate('Big5ClosedScreen', {
      ...this.state,
      title: sourcesNames[context],
      subtitle: now,
      source: context,
    });
  }

  _toggleInfo() {
    this.setState(prev => ({
      status: !prev.status,
    }));
  }

  render() {
    const {
      text,
      finished,
      gettingResults,
      gettingCategories,
      context,
      status,
      testStatus,
      error,
      randomCategory,
    } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <NavBar style={{ marginVertical: 10 }}>
            <NavButton
              style={{ color: viewTint }}
              name="arrow-round-back"
              onPress={() => navigation.goBack()}
            />
            {!gettingCategories && (
              <NavButton
                name="repeat"
                style={{ color: viewTint }}
                onPress={this._changeRandomCategory}
              />
            )}
            <NavButton
              name={status ? 'information-circle' : 'information'}
              style={{ color: viewTint }}
              onPress={this._toggleInfo}
            />
          </NavBar>
          {!finished && (
            <Transition appear="top">
              <MessageBubble style={{ marginBottom: 10 }}>
                {gettingResults && <ActivityIndicator size="large" color={viewTint} />}
                {!context && !gettingResults && !gettingCategories && (
                  <Text style={styles.charNumText}>{`${text.length}/${RECOMMENDED_CHARS}`}</Text>
                )}
              </MessageBubble>
            </Transition>
          )}
          {(finished || (!gettingResults && !context && randomCategory)) && (
            <Transition appear="bottom">
              <TextComposer
                style={styles.textComposer}
                onPressCancel={this._onPressCancel}
                onChangeText={t => this.setState({ text: t })}
                onPressSend={this._onPressSend}
                finished={finished}
                randomCategory={randomCategory}
              />
            </Transition>
          )}
          {finished && !error && (
            <Transition appear="bottom">
              <Button style={{ marginVertical: 10 }} onPress={this._onPressInfo}>
                <ButtonText>See your results!</ButtonText>
              </Button>
            </Transition>
          )}
          {testStatus && (
            <Transition appear="bottom">
              <MessageBubble style={{ marginVertical: 10 }}>
                <Text style={styles.charNumText}>{testStatus}</Text>
              </MessageBubble>
            </Transition>
          )}
          {status && <Text style={styles.additionalInfo}>{this._getInfoMessage()}</Text>}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  textComposer: {
    flex: 0,
  },
  additionalInfo: {
    backgroundColor: 'yellow',
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  charNumText: { fontSize: 18, fontWeight: '600', color: viewTint, textAlign: 'center' },
});

export default TextScreen;