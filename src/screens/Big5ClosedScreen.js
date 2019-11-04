import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import PropTypes from "prop-types";
import { getUserRecommendations } from "../services/spotify";
import NavButton from "../components/NavButton";
import NavBar from "../components/NavBar";
import Bar from "../components/Bar";
import Button from "../components/Button";
import ButtonText from "../components/ButtonText";
import BubbleText from "../components/BubbleText";
import GetSpotifyRecommendations from "../components/GetSpotifyRecommendations";
import personalityInfo from "../data/personality";

const consumptionPreferencesText =
  "I filtered items from the next categories with score > 0.5 and < 0.5, which means that you were likely or unlikely to prefer it";

const Big5ClosedScreen = ({ navigation }) => {
  const { getParam } = navigation;
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
  const _toggleInfo = () => {
    setStatus(!status);
  };
  useEffect(() => {
    StatusBar.setBarStyle("dark-content", true);
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
        <Text style={styles.title}>Results</Text>
        <NavButton
          name={status ? "information-circle" : "information-circle-outline"}
          onPress={_toggleInfo}
        />
      </NavBar>
      <ScrollView style={{ ...styles.container, paddingHorizontal: 20 }}>
        {content && (
          <Button onPress={_goToData}>
            <ButtonText>Check what Watson used to analyze you</ButtonText>
          </Button>
        )}

        <BubbleText title="Personality" />
        {status && context === "text" && (
          <View>
            <Text style={styles.additionalInfo}>
              Your Personality was analyzed based on this text that you entered:
            </Text>
            <Text style={styles.additionalInfo}>{text}</Text>
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
                  {personalityInfo[p.trait_id].leftIntervalText}
                </Text>
                <Text style={{ maxWidth: "30%" }}>
                  {personalityInfo[p.trait_id].rightIntervalText}
                </Text>
              </View>
              <Bar
                style={{
                  marginVertical: 10,
                  backgroundColor: personalityInfo[p.trait_id].color
                }}
                key={p.name}
                title={p.name}
                percentage={p.percentile}
              >
                <Text style={{ padding: 5, color: "white" }}>
                  {`${p.name} (${parseInt(p.percentile * 100, 10)}%)`}
                </Text>
              </Bar>
              {status && (
                <Text
                  key={personalityInfo[p.trait_id].description}
                  style={styles.additionalInfo}
                >
                  {personalityInfo[p.trait_id].description}
                </Text>
              )}
            </View>
          ))}
        </View>
        <View>
          {status && (
            <Text style={styles.additionalInfo}>
              {consumptionPreferencesText}
            </Text>
          )}
          {consumption_preferences.map(cp => {
            const filteredConsumptions = cp.consumption_preferences.filter(
              pref => pref.score !== 0.5
            );
            return filteredConsumptions.length ? (
              <View key={cp.consumption_preference_category_id}>
                <BubbleText title={cp.name} />
                {filteredConsumptions.map(item => (
                  <Text
                    key={item.consumption_preference_id}
                    style={{ marginVertical: 5 }}
                  >
                    · {item.name}
                  </Text>
                ))}
              </View>
            ) : null;
          })}
        </View>
        <View>
          <BubbleText title="Spotify" />
          <GetSpotifyRecommendations onPress={_onPressSpotify} />
        </View>
        <Button onPress={_onPressHome} style={{ marginVertical: 20 }}>
          <ButtonText>Go Home</ButtonText>
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
    backgroundColor: "yellow",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ecf0f1"
  }
});

export default Big5ClosedScreen;
