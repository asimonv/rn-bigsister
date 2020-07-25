import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import moment from "moment";
import Icon from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import NavBar from "../components/NavBar";
import NavButton from "../components/NavButton";
import ComparisonGraph from "../components/ComparisonGraph";
import GraphLegends from "../components/GraphLegends";
import BubbleText from "../components/BubbleText";
import StyledPicker from "../components/StyledPicker";

import personalityInfo from "../data/personality";
import dataSources from "../data/data-sources";
import ListItem from "../components/ListItem";

const viewTint = "#5352ed";

const sourcesNames = {
  tw: "Twitter",
  fb: "Facebook",
  text: "Text",
};

const CompareStatsScreen = ({ navigation }) => {
  const [hidden] = useState(true);
  const [selected, setSelected] = useState(new Map());
  const [history, setHistory] = useState();
  const [graphLegends, setGraphLegends] = useState(dataSources);
  const [personalitiesData, setPersonalitiesData] = useState();
  const [selectedPersonality, setSelectedPersonality] = useState();
  const { t, i18n } = useTranslation();
  const originalHistory = navigation.getParam("history");

  useEffect(() => {
    async function loadPersonalities() {
      let data;
      if (i18n.language === "es") {
        data = await import("../data/popular-es");
      } else {
        data = await import("../data/popular-en");
      }
      setPersonalitiesData(data);
      filterHistory(originalHistory);
      setGraphLegends(dataSources);
    }
    loadPersonalities();

    StatusBar.setBarStyle("dark-content", true);
    return () => {
      StatusBar.setBarStyle("light-content", true);
    };
  }, []);

  const onSelect = useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected]
  );

  useEffect(() => {
    filterHistory(originalHistory);
    if (personalitiesData) {
      const { data } = personalitiesData;

      if (selectedPersonality !== undefined) {
        const joinedTests = joinTests(
          originalHistory.filter(x => !selected.get(x.date))
        );
        const injectedPersonalityTests = Array.prototype.concat(
          data[selectedPersonality].map(x => ({ ...x, source: "manual" })),
          joinedTests
        );
        const groupedData = _.groupBy(
          injectedPersonalityTests,
          x => x.trait_id
        );
        const points = Object.keys(groupedData).map(k => ({
          title: k,
          leftText: personalityInfo(t)[k].leftIntervalText,
          rightText: personalityInfo(t)[k].rightIntervalText,
          points: groupedData[k],
        }));
        setHistory(points);
      }
    }
  }, [selected]);

  const joinTests = userHistory => {
    const filteredData = userHistory.filter(x => !selected.get(x.date));
    const formatedData = _.chain(filteredData)
      .map(x => [
        ...x.info.personality.map(y => ({
          ...y,
          source: x.source,
          date: x.date,
          detailText: `(${parseInt(y.percentile * 100, 10)}%) - ${moment(
            x.date
          ).format("MMMM Do YYYY, h:mm:ssA")}`,
        })),
      ])
      .value();

    const joinedTests = Array.prototype.concat(...formatedData);

    return joinedTests;
  };

  const filterHistory = userHistory => {
    const joinedTests = joinTests(userHistory);
    const groupedData = _.groupBy(joinedTests, x => x.trait_id);

    const points = Object.keys(groupedData).map(k => ({
      title: k,
      leftText: personalityInfo(t)[k].leftIntervalText,
      rightText: personalityInfo(t)[k].rightIntervalText,
      points: groupedData[k],
    }));

    setHistory(points);
  };

  const _handlePress = item => {
    const { title, subtitle, data } = item;
    navigation.navigate("Big5ClosedScreen", { ...data, title, subtitle });
  };

  const renderItem = item => {
    const adaptedItem = {
      id: item.date,
      title: moment(item.date).format("MMMM Do YYYY, h:mm:ssA"),
      subtitle: `${sourcesNames[item.source]}${
        item.modified ? ` (${t("modified")}) ` : ""
      }${item.description ? ` - ${item.description}` : ""}${
        item.language ? `${item.language === "en" ? " 🇬🇧 " : " 🇪🇸 "}` : ""
      }`,
      data: item,
    };
    return (
      <ListItem
        id={adaptedItem.id}
        editing
        onPressDelete={onSelect}
        selected={!!selected.get(adaptedItem.id)}
        onPress={_handlePress}
        item={adaptedItem}
      />
    );
  };

  const _handlePickerOnChange = value => {
    const { labels, data } = personalitiesData;

    if (value) {
      setSelectedPersonality(value);
      const newLegend = labels.find(x => x.value === value);
      const joinedTests = joinTests(
        originalHistory.filter(x => !selected.get(x.date))
      );
      const injectedPersonalityTests = Array.prototype.concat(
        data[value].map(x => ({ ...x, source: "manual" })),
        joinedTests
      );
      const groupedData = _.groupBy(injectedPersonalityTests, x => x.trait_id);
      const points = Object.keys(groupedData).map(k => ({
        title: k,
        leftText: personalityInfo(t)[k].leftIntervalText,
        rightText: personalityInfo(t)[k].rightIntervalText,
        points: groupedData[k],
      }));
      setHistory(points);
      setGraphLegends([
        ...dataSources,
        { title: newLegend.label, color: newLegend.legendColor },
      ]);
    } else {
      filterHistory(originalHistory);
      setGraphLegends(dataSources);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" animated />
        <Transition appear="top">
          <NavBar style={{ marginVertical: 20, marginHorizontal: 20 }}>
            <NavButton
              style={{ color: viewTint }}
              name="arrow-round-back"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>{t("compare-sources-title")}</Text>
          </NavBar>
        </Transition>
        <Transition appear="bottom" disappear="bottom">
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.contentContainer}>
              {hidden && (
                <Text style={{ marginVertical: 20 }}>
                  {t("compare.helper")}
                </Text>
              )}
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                margin: 15,
                borderRadius: 5,
              }}
            >
              {originalHistory.map(x => renderItem(x))}
            </View>
            <View style={styles.contentContainer}>
              <Icon
                name="arrow-down"
                size={40}
                color="black"
                style={{ textAlign: "center", marginVertical: 30 }}
              />
              <Text>{t("compare.click")}</Text>
              {history && <ComparisonGraph data={history} />}
              <GraphLegends data={graphLegends} />
            </View>
            {!personalitiesData ? (
              <ActivityIndicator />
            ) : (
              <>
                <Icon
                  name="arrow-up"
                  size={40}
                  color="black"
                  style={{ textAlign: "center", marginVertical: 30 }}
                />
                <View style={[styles.contentContainer, { marginBottom: 20 }]}>
                  <BubbleText title={t("compare.title")} />
                  <Text style={{ marginBottom: 20 }}>
                    {t("compare.subtitle")}
                  </Text>
                  <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
                    {t("compare.selectGraph")}
                  </Text>
                  <StyledPicker
                    onValueChange={value => _handlePickerOnChange(value)}
                    placeholder={t("compare.select").toUpperCase()}
                    data={personalitiesData.labels}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </Transition>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 10,
    display: "flex",
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute",
    textAlign: "center",
    color: "black",
    left: 0,
    right: 0,
    zIndex: -1,
  },
});

export default CompareStatsScreen;
