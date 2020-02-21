import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Transition } from "react-navigation-fluid-transitions";
import { useTranslation } from "react-i18next";
import moment from "moment";
import NavBar from "../components/NavBar";
import NavButton from "../components/NavButton";
import MessageBubble from "../components/MessageBubble";
import Button from "../components/Button";
import ButtonText from "../components/ButtonText";
import AditionalInfoText from "../components/AditionalInfoText";
import pInsights from "../services/watson";
import genres from "../data/genre-seeds";
import saveTest from "../utils/saving";

const viewTint = "#c0392b";
const sourcesNames = {
  tw: "Twitter",
  fb: "Facebook",
  text: "Text"
};

const NewTestScreen = props => {
  const {
    navigation: { getParam, navigate, goBack }
  } = props;
  const [showInfo, setShowInfo] = useState(false);
  const [testStatus, setTestStatus] = useState();
  const [finished, setFinished] = useState();
  const [insights, setInsights] = useState();
  const [filters, setFilters] = useState();
  const context = getParam("context");
  const data = getParam("data");
  const { t, language } = useTranslation();

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const getInsights = async content => {
      setTestStatus(`${t("fetching.watson")}`);
      const res = await pInsights({ contentItems: content, language }, signal);
      if (!res.code) {
        setInsights(res);
        setTestStatus(t("greetings-text"));
        setFinished(true);

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

        setFilters({ seed_genres: reqGenres });

        await saveTest(
          {
            modified: true,
            info: res,
            content: { data },
            filters: { seed_genres: reqGenres }
          },
          context
        );
      }
    };
    let content;
    switch (context) {
      case "tw": {
        content = data.map(tw => ({
          content: tw.text,
          contenttype: "text/plain",
          id: `${tw.id}`
        }));
        break;
      }

      case "fb": {
        content = data.map(p => ({
          content: p.message,
          contenttype: "text/plain",
          id: p.id
        }));
        break;
      }
      default:
        break;
    }

    getInsights(content);

    return () => {
      abortController.abort();
    };
  }, []);

  const _getInfoMessage = () => {
    switch (context) {
      case "fb":
        return t("fetching.moreInfo.fb");
      case "tw":
        return t("fetching.moreInfo.tw");
      default:
        return t("fetching.moreInfo.text");
    }
  };

  const _handleCheckResults = () => {
    const now = moment().format("MMMM Do YYYY, h:mm:ssA");
    navigate("Big5ClosedScreen", {
      info: insights,
      content: { data },
      filters,
      title: sourcesNames[context],
      subtitle: now,
      source: context
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Transition appear="top">
        <NavBar style={{ marginVertical: 10 }}>
          <NavButton
            style={{ color: viewTint }}
            name="arrow-round-back"
            onPress={() => goBack()}
          />
          <NavButton
            name={showInfo ? "information-circle" : "information"}
            style={{ color: viewTint }}
            onPress={() => setShowInfo(!showInfo)}
          />
        </NavBar>
      </Transition>
      <Transition appear="bottom">
        <View>
          {!finished && (
            <MessageBubble style={{ marginVertical: 10 }}>
              <ActivityIndicator size="large" color={viewTint} />
            </MessageBubble>
          )}
          {testStatus && (
            <MessageBubble style={{ marginVertical: 10 }}>
              <Text style={styles.charNumText}>{testStatus}</Text>
            </MessageBubble>
          )}
          {finished && (
            <Button
              style={{ marginVertical: 10 }}
              onPress={_handleCheckResults}
            >
              <ButtonText>{t("see-results")}</ButtonText>
            </Button>
          )}
        </View>
      </Transition>
      {showInfo && <AditionalInfoText>{_getInfoMessage()}</AditionalInfoText>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start"
  },
  charNumText: {
    fontSize: 18,
    fontWeight: "600",
    color: viewTint,
    textAlign: "center"
  }
});

export default NewTestScreen;
