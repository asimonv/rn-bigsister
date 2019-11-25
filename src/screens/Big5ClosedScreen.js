import React, { useState, useEffect } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getUserRecommendations } from "../services/spotify";
import NavButton from "../components/NavButton";
import NavBar from "../components/NavBar";
import Bar from "../components/Bar";
import Button from "../components/Button";
import ButtonText from "../components/ButtonText";
import BubbleText from "../components/BubbleText";
import AditionalInfoText from "../components/AditionalInfoText";
import GetSpotifyRecommendations from "../components/GetSpotifyRecommendations";
import personalityInfo from "../data/personality";

const lowercaseFirstLetter = string =>
  string[0].toLowerCase() + string.slice(1);

const Big5ClosedScreen = ({ navigation }) => {
  const { getParam } = navigation;
  const { t } = useTranslation();
  const [status, setStatus] = useState(false); // ñaaaau first hook
  const info = getParam("info");
  const content = getParam("content");
  const filters = getParam("filters");
  const title = getParam("title");
  const subtitle = getParam("subtitle");
  const context = getParam("source");
  const text = getParam("text");
  const { personality, consumption_preferences } = info;
  const sortedPersonalities = personality.sort(
    (a, b) => a.percentile > b.percentile
  );
  const consumptionPreferencesText = t("consumption-preferences-text");
  const _toggleInfo = () => {
    setStatus(!status);
  };
  useEffect(() => {
    StatusBar.setBarStyle("dark-content", true);
    console.log(info);
    return () => {
      StatusBar.setBarStyle("light-content", true);
    };
  }, []);

  const _goToData = () => {
    const { navigate } = navigation;
    navigate("AnalyzedDataScreen", { content: [...content.data], context });
  };

  const _onPressHome = () => {
    const { navigate } = navigation;
    navigate("Home");
  };

  const _onPressSpotify = async () => {
    const { navigate } = navigation;
    const limit = 50;
    const recommendations = await getUserRecommendations({ ...filters, limit });
    if (recommendations) {
      navigate("screen1", { recommendations, info, filters, title, subtitle });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <ScrollView style={{ ...styles.container, paddingHorizontal: 20 }}>
        {content && (
          <Button onPress={_goToData}>
            <ButtonText>{t("check-data-message")}</ButtonText>
          </Button>
        )}

        <BubbleText title={t("personality")} />
        {status && context === "text" && (
          <View>
            <AditionalInfoText>{`${t("test-text-based")}:`}</AditionalInfoText>
            <AditionalInfoText>{text}</AditionalInfoText>
          </View>
        )}
        <View>
          {sortedPersonalities.map(p => (
            <View style={{ flex: 1, marginVertical: 15 }} key={p.trait_id}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ maxWidth: "30%" }}>
                  {personalityInfo(t)[p.trait_id].leftIntervalText}
                </Text>
                <Text style={{ maxWidth: "30%" }}>
                  {personalityInfo(t)[p.trait_id].rightIntervalText}
                </Text>
              </View>
              <Bar
                style={{
                  marginVertical: 10,
                  backgroundColor: personalityInfo(t)[p.trait_id].color
                }}
                key={p.name}
                title={p.name}
                percentage={p.percentile}
              >
                <Text style={{ padding: 5, color: "white" }}>
                  {`${personalityInfo(t)[p.trait_id].title} (${parseInt(
                    p.percentile * 100,
                    10
                  )}%)`}
                </Text>
              </Bar>
              {status && (
                <AditionalInfoText
                  key={personalityInfo(t)[p.trait_id].description}
                >
                  {personalityInfo(t)[p.trait_id].description}
                </AditionalInfoText>
              )}
            </View>
          ))}
        </View>
        <View>
          {status && (
            <>
              <AditionalInfoText>
                {t("test_calculation_message")}
              </AditionalInfoText>
            </>
          )}
          {consumption_preferences.map(cp => {
            console.log(cp);
            const filteredConsumptions = cp.consumption_preferences.filter(
              pref => pref.score !== 0.5
            );
            return filteredConsumptions.length ? (
              <View key={cp.consumption_preference_category_id}>
                <BubbleText
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
        <View>
          <BubbleText title="Spotify" />
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
        <Button onPress={_onPressHome} style={{ marginVertical: 20 }}>
          <ButtonText>{t("go-home")}</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

Big5ClosedScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute",
    textAlign: "center",
    left: 0,
    right: 0,
    zIndex: -1
  },
  goBackButton: {
    fontSize: 18,
    fontWeight: "600",
    color: "rebeccapurple",
    textAlign: "center",
    padding: 5
  },
  additionalInfo: {
    backgroundColor: "white",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ecf0f1"
  }
});

export default Big5ClosedScreen;
