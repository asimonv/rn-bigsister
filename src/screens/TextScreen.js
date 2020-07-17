import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Transition } from "react-navigation-fluid-transitions";
import AsyncStorage from "@react-native-community/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import { withTranslation } from "react-i18next";

import TextComposer from "../components/TextComposer";
import MessageBubble from "../components/MessageBubble";
import NavButton from "../components/NavButton";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import ButtonText from "../components/ButtonText";
import AditionalInfoText from "../components/AditionalInfoText";
import StyledPicker from "../components/StyledPicker";

import pInsights from "../services/watson";
import { fetchLikes } from "../services/facebook";
import fetchTweets from "../services/twitter";
import textCategories from "../services/options";
import genres from "../data/genre-seeds";

import { saveTest } from "../utils/saving";

const RECOMMENDED_CHARS = 280;
const viewTint = "#c0392b";

const sourcesNames = {
  tw: "Twitter",
  fb: "Facebook",
  text: "Text",
};

const textSources = t => [
  { label: `${t("write-something-about")} ...`, value: 0 },
  { label: `${t("text-sources.copy.title")}`, value: 1 },
  { label: `${t("text-sources.publicFigure.title")}`, value: 2 },
];

class TextScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      started: false,
      text: "",
      status: false,
      finished: false,
      gettingResults: false,
      gettingCategories: true,
      categories: null,
      randomCategory: null,
      selectedSourceType: null,
      error: false,
      showRandom: false,
      filters: {
        energy: 0.2,
        min_popularity: 50,
        seed_genres: ["chill"],
        max_valence: 0.2,
      },
    };
    this._onPressSend = this._onPressSend.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this._onPressInfo = this._onPressInfo.bind(this);
    this._toggleInfo = this._toggleInfo.bind(this);
    this._getInfoMessage = this._getInfoMessage.bind(this);
  }

  async componentDidMount() {
    const {
      navigation,
      t,
      i18n: { language },
    } = this.props;
    const context = navigation.getParam("context");
    switch (context) {
      case "fb":
        this.setState({
          gettingResults: true,
          started: true,
          testStatus: `${t("fetching.fb")}`,
        });
        try {
          const posts = await fetchLikes();
          const content = posts.data.map(p => ({
            content: p.message,
            contenttype: "text/plain",
            id: p.id,
          }));
          if (content.length) {
            this.setState({
              testStatus: `${t("fetching.watson")}`,
              content: posts,
            });
            const res = await pInsights({
              contentItems: content,
              language,
            });
            this.setState(prev => ({
              finished: !prev.finished,
              gettingResults: !prev.gettingResults,
              error: res.code && res.code !== 200,
              testStatus:
                res.code && res.code !== 200 ? res.message : undefined,
            }));

            if (!res.code) {
              const musicPreferences = res.consumption_preferences.find(
                cp =>
                  cp.consumption_preference_category_id ===
                  "consumption_preferences_music"
              );
              const preferredGenres = musicPreferences.consumption_preferences.filter(
                c => c.score > 0
              );
              const reqGenres = preferredGenres
                .map(pg => {
                  const splittedPref = pg.consumption_preference_id.split("_");
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
                  await saveTest(this.state, context, language);
                }
              );
            }
          } else {
            this.setState(prev => ({
              finished: !prev.finished,
              error: true,
              testStatus: `${t("fetching.error")}`,
            }));
          }
        } catch (e) {
          console.log(e);
        }
        break;
      case "tw":
        this.setState({
          gettingResults: true,
          started: true,
          testStatus: `${t("fetching.tw")}`,
        });
        try {
          const userId = await AsyncStorage.getItem("@LittleStore:twitterId");
          const tweets = await fetchTweets(userId);
          const content = tweets.data.map(tw => ({
            content: tw.text,
            contenttype: "text/plain",
            id: `${tw.id}`,
          }));
          if (content.length) {
            this.setState({
              testStatus: `${t("fetching.watson")}`,
              content: tweets,
            });
            const res = await pInsights({
              contentItems: content,
              language,
            });
            this.setState(prev => ({
              finished: !prev.finished,
              gettingResults: !prev.gettingResults,
              error: res.code && res.code !== 200,
              testStatus:
                res.code && res.code !== 200 ? res.message : undefined,
            }));

            if (!res.code) {
              const musicPreferences = res.consumption_preferences.find(
                cp =>
                  cp.consumption_preference_category_id ===
                  "consumption_preferences_music"
              );
              const preferredGenres = musicPreferences.consumption_preferences.filter(
                c => c.score > 0
              );
              const reqGenres = preferredGenres
                .map(pg => {
                  const splittedPref = pg.consumption_preference_id.split("_");
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
                  await saveTest(this.state, context, language);
                }
              );
            }
          } else {
            this.setState(prev => ({
              finished: !prev.finished,
              error: true,
              testStatus: `${t("fetching.error")}`,
            }));
          }
        } catch (e) {
          console.log(e);
        }
        break;
      default:
        break;
    }
  }

  _handlePickerChange = async value => {
    const {
      navigation,
      t,
      i18n: { language },
    } = this.props;
    if (value !== null) {
      this.setState({
        started: true,
        text: "",
        selectedSourceType: value,
      });
      switch (value) {
        case 0: {
          try {
            this.setState({
              gettingResults: true,
              testStatus: `${t("fetching.categories")}`,
              showRandom: true,
            });
            const categories = await textCategories(language);
            const { data } = categories;
            const randomCategory =
              data[Math.floor(Math.random() * data.length)];
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

        case 1: {
          this.setState({
            gettingResults: false,
            gettingCategories: false,
            testStatus: undefined,
            randomCategory: true,
            showRandom: false,
          });
          break;
        }

        default:
          this.setState({
            gettingResults: false,
            gettingCategories: false,
            testStatus: undefined,
            randomCategory: true,
            showRandom: false,
          });
          break;
      }
    } else {
      this.setState({
        started: false,
        selectedSourceType: value,
        randomCategory: null,
        showRandom: false,
      });
    }
  };

  _changeRandomCategory = () => {
    const {
      categories: { data },
    } = this.state;
    const randomCategory = data[Math.floor(Math.random() * data.length)];
    this.setState({ randomCategory });
  };

  _generatePlaceholder = type => {
    const { randomCategory } = this.state;
    const { t } = this.props;
    switch (type) {
      case 0:
        return `${t("write-something-about")} ${randomCategory}`;
      case 1:
        return `${t("text-sources.copy.placeholder")}`;
      case 2:
        return `${t("text-sources.publicFigure.placeholder")}`;
      default:
        break;
    }
  };

  _onSelectedText = ({ phraseText }) => {
    this.setState(prev => ({ text: prev.text + phraseText }));
  };

  _onPressSend() {
    const {
      i18n: { language },
      t,
      navigation: { navigate },
      navigation,
    } = this.props;
    const context = navigation.getParam("context");
    const { text } = this.state;
    if (
      context === "text" &&
      (text.match(/\s/g) || []).length < RECOMMENDED_CHARS
    ) {
      Alert.alert(t("min-words-error"), "", [
        { text: t("OK"), style: "cancel" },
      ]);

      return;
    }

    this.setState(
      prev => ({
        gettingResults: !prev.gettingResults,
        testStatus: `${t("fetching.watson")}`,
      }),
      async () => {
        try {
          const { text } = this.state;
          const res = await pInsights({ text, language });
          this.setState(prev => ({
            finished: !prev.finished,
            gettingResults: !prev.gettingResults,
            error: res.code && res.code !== 200,
            testStatus: res.code && res.code !== 200 ? res.message : undefined,
          }));

          if (!res.code) {
            const musicPreferences = res.consumption_preferences.find(
              cp =>
                cp.consumption_preference_category_id ===
                "consumption_preferences_music"
            );
            const preferredGenres = musicPreferences.consumption_preferences.filter(
              c => c.score > 0
            );
            const reqGenres = preferredGenres
              .map(pg => {
                const splittedPref = pg.consumption_preference_id.split("_");
                return splittedPref[splittedPref.length - 1];
              })
              .filter(g => genres.includes(g));
            this.setState(
              {
                filters: { seed_genres: reqGenres },
                info: res,
              },
              async () => {
                await saveTest(this.state, "text", language);
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
    const { navigation, t } = this.props;
    const context = navigation.getParam("context");
    switch (context) {
      case "fb":
        return t("fetching.moreInfo.fb");
      case "tw":
        return t("fetching.moreInfo.tw");
      default:
        return t("fetching.moreInfo.text");
    }
  }

  _onPressCancel() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  _onPressInfo() {
    const {
      navigation,
      i18n: { language },
    } = this.props;
    const { navigate } = navigation;
    const now = moment().format("MMMM Do YYYY, h:mm:ssA");
    const context = navigation.getParam("context");
    navigate("Big5ClosedScreen", {
      ...this.state,
      title: sourcesNames[context],
      subtitle: now,
      source: context,
      language,
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
      started,
      randomCategory,
      selectedSourceType,
      showRandom,
    } = this.state;
    const { navigation, t } = this.props;
    const navigationContext = navigation.getParam("context");

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          scrollEnabled={selectedSourceType !== 2}
          contentContainerStyle={[
            selectedSourceType === 2 && !finished ? { flex: 1 } : {},
            { padding: 10 },
          ]}
        >
          <Transition appear="top">
            <NavBar style={{ marginVertical: 10 }}>
              <NavButton
                style={{ color: viewTint }}
                name="arrow-round-back"
                onPress={() => navigation.goBack()}
              />
              {!gettingCategories && showRandom && (
                <NavButton
                  name="repeat"
                  style={{ color: viewTint }}
                  onPress={this._changeRandomCategory}
                />
              )}
              <NavButton
                name={status ? "information-circle" : "information"}
                style={{ color: viewTint }}
                onPress={this._toggleInfo}
              />
            </NavBar>
          </Transition>
          {navigationContext === "text" && !finished && !gettingResults && (
            <Transition appear="top">
              <View style={{ marginBottom: 10 }}>
                <StyledPicker
                  data={textSources(t)}
                  onValueChange={this._handlePickerChange}
                  placeholder={t("text-sources.picker").toUpperCase()}
                />
              </View>
            </Transition>
          )}
          {!finished && started && (
            <Transition appear="top">
              <MessageBubble style={{ marginBottom: 10 }}>
                {gettingResults && (
                  <ActivityIndicator size="large" color={viewTint} />
                )}
                {!context && !gettingResults && !gettingCategories && (
                  <Text style={styles.charNumText}>{`${
                    (text.match(/\s/g) || []).length
                  }/${RECOMMENDED_CHARS}`}</Text>
                )}
              </MessageBubble>
            </Transition>
          )}
          <View
            style={{
              flex: 1,
            }}
          >
            {(finished || (!gettingResults && !context && randomCategory)) && (
              <Transition appear="bottom">
                <TextComposer
                  placeholder={this._generatePlaceholder(selectedSourceType)}
                  style={styles.textComposer}
                  onPressCancel={this._onPressCancel}
                  onChangeText={x => this.setState({ text: x })}
                  onPressSend={this._onPressSend}
                  onSelectedText={this._onSelectedText}
                  finished={finished}
                  selectedSourceType={selectedSourceType}
                  randomCategory={randomCategory}
                />
              </Transition>
            )}
            {finished && !error && (
              <Transition appear="bottom">
                <Button
                  style={{ marginVertical: 10 }}
                  onPress={this._onPressInfo}
                >
                  <ButtonText>{t("see-results")}</ButtonText>
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
            {status && (
              <AditionalInfoText>{this._getInfoMessage()}</AditionalInfoText>
            )}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
  },
  textComposer: {
    flex: 1,
  },
  additionalInfo: {
    backgroundColor: "yellow",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  charNumText: {
    fontSize: 18,
    fontWeight: "600",
    color: viewTint,
    textAlign: "center",
  },
});

export default withTranslation()(TextScreen);
