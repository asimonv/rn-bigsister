import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import moment from 'moment';
import _ from 'lodash';
import CalendarPicker from 'react-native-calendar-picker';
import NavBar from '../components/NavBar';
import NavButton from '../components/NavButton';
import Button from '../components/Button';
import ButtonText from '../components/ButtonText';
import ComparisonGraph from '../components/ComparisonGraph';
import personalityInfo from '../data/personality';

const viewTint = '#5352ed';
const datePlaceholder = 'Select a range of dates';

const CompareStatsScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [endDate, setEndDate] = useState();
  const [hidden, setHidden] = useState(true);
  const [history, setHistory] = useState();
  const { width } = Dimensions.get('window');
  const originalHistory = navigation.getParam('history');

  useEffect(() => {
    setHistory(originalHistory);
  }, []);

  useEffect(() => {
    if (endDate) {
      filterHistory(originalHistory);
      setIsLoaded(true);
    }
  }, [endDate]);

  const filterHistory = userHistory => {
    const filteredData = userHistory.filter(x => {
      const formatedDate = moment(x.date);
      return formatedDate.isSameOrBefore(endDate) && formatedDate.isSameOrAfter(startDate);
    });

    const data = _.chain(filteredData)
      .map(x => [
        ...x.info.personality.map(y => ({
          ...y,
          source: x.source,
          date: x.date,
        })),
      ])
      .value();

    const joinedTests = Array.prototype.concat(...data);
    const groupedData = _.groupBy(joinedTests, x => x.trait_id);
    const points = Object.keys(groupedData).map(k => ({
      title: k,
      leftText: personalityInfo[k].leftIntervalText,
      rightText: personalityInfo[k].rightIntervalText,
      points: groupedData[k],
    }));

    setHistory(points);
  };

  const _onDateChange = (date, type) => {
    switch (type) {
      case 'END_DATE':
        setEndDate(date.format('LL').toString());
        setHidden(!hidden);
        break;
      default:
        setStartDate(date.format('LL').toString());
        break;
    }
  };

  const _onPressButtonDatePicker = () => {
    setHidden(!hidden);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" animated />
        <Transition appear="top">
          <NavBar style={{ marginVertical: 20, marginHorizontal: 20 }}>
            <NavButton
              style={{ color: viewTint }}
              name="arrow-round-back"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Compare Sources</Text>
          </NavBar>
        </Transition>
        <Transition appear="bottom" disappear="bottom">
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}>
            <Button onPress={_onPressButtonDatePicker}>
              <ButtonText>
                {startDate && endDate ? `${startDate} - ${endDate}` : datePlaceholder}
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
                <ComparisonGraph data={history} />
                <View
                  style={[styles.container, { flexDirection: 'row', justifyContent: 'center' }]}
                >
                  <View style={styles.statDetail}>
                    <View style={[styles.statColor, { backgroundColor: 'blue' }]} />
                    <Text style={styles.statTitle}>Facebook</Text>
                  </View>
                  <View style={styles.statDetail}>
                    <View style={[styles.statColor, { backgroundColor: 'lightblue' }]} />
                    <Text style={styles.statTitle}>Twitter</Text>
                  </View>
                  <View style={styles.statDetail}>
                    <View style={[styles.statColor, { backgroundColor: 'gray' }]} />
                    <Text style={styles.statTitle}>Text</Text>
                  </View>
                </View>
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
    margin: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  statTitle: {
    marginLeft: 5,
  },
  statDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    textAlign: 'center',
    color: 'black',
    left: 0,
    right: 0,
    zIndex: -1,
  },
});

export default CompareStatsScreen;
