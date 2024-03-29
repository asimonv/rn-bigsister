import React, { useState, useEffect } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Transition } from "react-navigation-fluid-transitions";
import _ from "lodash";
import moment from "moment";

import { getUserRecommendations } from "../services/spotify";
import NavButton from "../components/NavButton";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import ButtonText from "../components/ButtonText";
import BubbleText from "../components/BubbleText";
import AditionalInfoText from "../components/AditionalInfoText";
import GetSpotifyRecommendations from "../components/GetSpotifyRecommendations";
import GraphBarWrapper from "../components/GraphBarWrapper";
import ComparisonGraph from "../components/ComparisonGraph";
import StyledPicker from "../components/StyledPicker";
import GraphLegends from "../components/GraphLegends";

import personalityInfo from "../data/personality";
import dataSources from "../data/data-sources";

const lowercaseFirstLetter = string =>
  string[0].toLowerCase() + string.slice(1);

const Big5ClosedScreen = ({ navigation }) => {
  const { getParam } = navigation;
  const { t, i18n } = useTranslation();
  const [points, setPoints] = useState();
  const [status, setStatus] = useState(false); // ñaaaau first hook
  const [personalitiesData, setPersonalitiesData] = useState();
  const [graphLegends, setGraphLegends] = useState(dataSources);
  const info = getParam("info");
  const content = getParam("content");
  const filters = getParam("filters");
  const title = getParam("title");
  const subtitle = getParam("subtitle");
  const context = getParam("source");
  const language = getParam("language");
  const text = getParam("text");
  const { personality, consumption_preferences } = info;
  const sortedPersonalities = personality.sort(
    (a, b) => a.percentile > b.percentile
  );
  const _toggleInfo = () => {
    setStatus(!status);
  };
  useEffect(() => {
    StatusBar.setBarStyle("dark-content", true);

    async function loadPersonalities() {
      let data;
      if (i18n.language === "es") {
        data = await import("../data/popular-es");
      } else {
        data = await import("../data/popular-en");
      }
      setPersonalitiesData(data);
    }

    loadPersonalities();

    return () => {
      StatusBar.setBarStyle("light-content", true);
    };
  }, []);

  const _goToData = () => {
    const { navigate } = navigation;
    navigate("AnalyzedDataScreen", {
      content: [...content.data],
      context,
      language,
    });
  };

  const _onPressHome = () => {
    const { navigate } = navigation;
    navigate("Home");
  };

  const _onPressSpotify = async () => {
    const { navigate } = navigation;
    const limit = 50;
    const recommendations = await getUserRecommendations(
      { ...filters, limit },
      t
    );
    if (recommendations) {
      navigate("screen1", { recommendations, info, filters, title, subtitle });
    }
  };

  const _onPressNewTest = async () => {
    const { navigate } = navigation;
    navigate("AnalyzedDataScreen", {
      content: [...content.data],
      context,
      editing: true,
      language,
    });
  };

  const _handleOnChangePicker = value => {
    const { labels, data } = personalitiesData;
    if (value) {
      const newLegend = labels.find(x => x.value === value);
      const injectedContext = personality.map(x => ({
        ...x,
        source: context,
        detailText: `(${parseInt(x.percentile * 100, 10)}%) - ${moment(
          x.date
        ).format("MMMM Do YYYY, h:mm:ssA")}`,
      }));
      const joinedTests = Array.prototype.concat(
        data[value].map(x => ({ ...x, source: "manual" })),
        injectedContext
      );
      const groupedData = _.groupBy(joinedTests, x => x.trait_id);
      const comparisonPoints = Object.keys(groupedData).map(k => ({
        title: k,
        leftText: personalityInfo(t)[k].leftIntervalText,
        rightText: personalityInfo(t)[k].rightIntervalText,
        points: groupedData[k],
      }));
      setPoints(comparisonPoints);
      setGraphLegends([
        ...dataSources,
        { title: newLegend.label, color: newLegend.legendColor },
      ]);
    } else {
      setPoints();
      setGraphLegends(dataSources);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Transition appear="top">
        <NavBar style={{ marginVertical: 10, marginHorizontal: 20 }}>
          <NavButton
            name="arrow-round-back"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>{t("results")}</Text>
          <NavButton
            name={status ? "information-circle" : "information-circle-outline"}
            onPress={_toggleInfo}
          />
        </NavBar>
      </Transition>
      <Transition appear="bottom">
        <ScrollView style={{ ...styles.container }}>
          <View style={styles.contentView}>
            {content && (
              <Button onPress={_goToData}>
                <ButtonText>{t("check-data-message")}</ButtonText>
              </Button>
            )}

            <BubbleText
              style={{ marginTop: 20, marginBottom: 0 }}
              title={t("personality")}
            />
            {status && context === "text" && (
              <View>
                <AditionalInfoText>{`${t(
                  "test-text-based"
                )}:`}</AditionalInfoText>
                <AditionalInfoText>{text}</AditionalInfoText>
              </View>
            )}
          </View>
          <View style={styles.contentView}>
            {sortedPersonalities.map(p => (
              <GraphBarWrapper key={p.trait_id} data={p} status={status} />
            ))}
          </View>
          <View style={styles.separator} />
          <View style={styles.contentView}>
            {status && (
              <>
                <AditionalInfoText>
                  {t("test_calculation_message")}
                </AditionalInfoText>
              </>
            )}
            {consumption_preferences.map(cp => {
              const filteredConsumptions = cp.consumption_preferences.filter(
                pref => pref.score !== 0.5
              );
              return filteredConsumptions.length ? (
                <View key={cp.consumption_preference_category_id}>
                  <BubbleText
                    style={{ marginTop: 20 }}
                    title={t(
                      `consumption_preferences.${cp.consumption_preference_category_id}.name`
                    )}
                  />
                  {status &&
                  cp.consumption_preference_category_id ===
                    "consumption_preferences_shopping" ? (
                    <AditionalInfoText>
                      {t("consumption-preferences-text")}
                    </AditionalInfoText>
                  ) : null}
                  {filteredConsumptions.map(item => (
                    <Text
                      key={item.consumption_preference_id}
                      style={{ marginVertical: 5 }}
                    >
                      ·{" "}
                      {item.score === 0
                        ? `${t("no")} ${lowercaseFirstLetter(
                            t(
                              `consumption_preferences.${cp.consumption_preference_category_id}.${item.consumption_preference_id}`
                            )
                          )}`
                        : t(
                            `consumption_preferences.${cp.consumption_preference_category_id}.${item.consumption_preference_id}`
                          )}
                    </Text>
                  ))}
                </View>
              ) : null;
            })}
          </View>
          <View style={styles.separator} />
          {personalitiesData && (
            <View style={styles.contentView}>
              <BubbleText title={t("compare.title")} />
              <Text style={{ marginBottom: 20 }}>{t("compare.subtitle")}</Text>
              <StyledPicker
                data={personalitiesData.labels}
                onValueChange={value => _handleOnChangePicker(value)}
                placeholder={t("compare.select").toUpperCase()}
              />
              {points && (
                <>
                  <Text style={{ marginTop: 20 }}>{t("compare.click")}</Text>
                  <ComparisonGraph data={points} />
                  <GraphLegends data={graphLegends} />
                </>
              )}
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.contentView}>
            <BubbleText title={t("spotify.title")} />
            <GetSpotifyRecommendations onPress={_onPressSpotify} />
            {status && (
              <AditionalInfoText>
                {`${t("spotify.more")} `}
                <Text
                  style={{ color: "blue" }}
                  onPress={() =>
                    Linking.openURL(
                      "https://developer.spotify.com/documentation/general/guides/authorization-guide/"
                    )
                  }
                >
                  {`${t("here")}`}
                </Text>
              </AditionalInfoText>
            )}
          </View>
          <View style={styles.separator} />
          {context !== "text" && (
            <View>
              <View style={styles.contentView}>
                <BubbleText title={t("new-test.title")} />
                <Text>{t("new-test.subtitle")}</Text>
                <Button
                  onPress={_onPressNewTest}
                  style={{ marginBottom: 10, marginTop: 40 }}
                >
                  <ButtonText>{t("new-test.button")}</ButtonText>
                </Button>
              </View>
              <View style={styles.separator} />
            </View>
          )}
          <View style={styles.contentView}>
            <BubbleText
              style={{ marginBottom: 0 }}
              title={t("other-options")}
            />
            <Button
              onPress={_onPressHome}
              style={{ marginBottom: 10, marginTop: 40 }}
            >
              <ButtonText>{t("go-home")}</ButtonText>
            </Button>
          </View>
        </ScrollView>
      </Transition>
    </SafeAreaView>
  );
};

Big5ClosedScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  separator: {
    height: 10,
    display: "flex",
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentView: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute",
    textAlign: "center",
    left: 0,
    right: 0,
    zIndex: -1,
  },
  goBackButton: {
    fontSize: 18,
    fontWeight: "600",
    color: "rebeccapurple",
    textAlign: "center",
    padding: 5,
  },
  additionalInfo: {
    backgroundColor: "white",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
});

export default Big5ClosedScreen;
