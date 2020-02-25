import React, { useState, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import moment from "moment";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import CalendarPicker from "react-native-calendar-picker";
import NavBar from "../components/NavBar";
import NavButton from "../components/NavButton";
import Button from "../components/Button";
import ButtonText from "../components/ButtonText";
import ComparisonGraph from "../components/ComparisonGraph";
import GraphLegends from "../components/GraphLegends";
import BubbleText from "../components/BubbleText";
import StyledPicker from "../components/StyledPicker";

import personalityInfo from "../data/personality";
import { labels, personalitiesData } from "../data/popular-es";
import dataSources from "../data/data-sources";

const viewTint = "#5352ed";

const CompareStatsScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [endDate, setEndDate] = useState();
  const [hidden, setHidden] = useState(true);
  const [history, setHistory] = useState();
  const { t } = useTranslation();
  const { width } = Dimensions.get("window");
  const originalHistory = navigation.getParam("history");

  useEffect(() => {
    setHistory(originalHistory);
    StatusBar.setBarStyle("dark-content", true);
    return () => {
      StatusBar.setBarStyle("light-content", true);
    };
  }, []);

  useEffect(() => {
    if (endDate) {
      filterHistory(originalHistory);
      setIsLoaded(true);
    }
  }, [endDate]);

  const joinTests = userHistory => {
    const filteredData = userHistory.filter(x => {
      const formatedDate = moment(x.date);
      return (
        formatedDate.isSameOrBefore(endDate) &&
        formatedDate.isSameOrAfter(startDate)
      );
    });

    const formatedData = _.chain(filteredData)
      .map(x => [
        ...x.info.personality.map(y => ({
          ...y,
          source: x.source,
          date: x.date,
          detailText: `(${parseInt(y.percentile * 100, 10)}%) - ${moment(
            x.date
          ).format("MMMM Do YYYY, h:mm:ssA")}`
        }))
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
      points: groupedData[k]
    }));

    setHistory(points);
  };

  const _onDateChange = (date, type) => {
    switch (type) {
      case "END_DATE":
        setEndDate(date.format("LL").toString());
        setHidden(!hidden);
        break;
      default:
        setStartDate(date.format("LL").toString());
        break;
    }
  };

  const _onPressButtonDatePicker = () => {
    setHidden(!hidden);
  };

  const _handlePickerOnChange = value => {
    if (value) {
      const joinedTests = joinTests(originalHistory);
      const injectedPersonalityTests = Array.prototype.concat(
        personalitiesData[value],
        joinedTests
      );
      const groupedData = _.groupBy(injectedPersonalityTests, x => x.trait_id);
      const points = Object.keys(groupedData).map(k => ({
        title: k,
        leftText: personalityInfo(t)[k].leftIntervalText,
        rightText: personalityInfo(t)[k].rightIntervalText,
        points: groupedData[k]
      }));
      setHistory(points);
    } else {
      filterHistory(originalHistory);
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
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.contentContainer}
          >
            <Button onPress={_onPressButtonDatePicker}>
              <ButtonText>
                {startDate && endDate
                  ? `${startDate} - ${endDate}`
                  : t("date-range")}
              </ButtonText>
            </Button>
            {!hidden && (
              <CalendarPicker
                allowRangeSelection
                width={width - 20 * 2}
                onDateChange={_onDateChange}
              />
            )}
            {isLoaded && (
              <View style={{ marginTop: 10 }}>
                <BubbleText title={t("compare.title")} />
                <Text style={{ marginBottom: 20 }}>
                  {t("compare.subtitle")}
                </Text>
                <StyledPicker
                  onValueChange={value => _handlePickerOnChange(value)}
                  placeholder={"Selecciona una figura pública".toUpperCase()}
                  data={labels}
                />
                <Text style={{ marginTop: 20 }}>{t("compare.click")}</Text>

                <ComparisonGraph data={history} />
                <GraphLegends data={dataSources} />
              </View>
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
    margin: 20
  },
  contentContainer: {
    paddingHorizontal: 20
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute",
    textAlign: "center",
    color: "black",
    left: 0,
    right: 0,
    zIndex: -1
  }
});

export default CompareStatsScreen;
