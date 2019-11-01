import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import AsyncStorage from '@react-native-community/async-storage';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import ListItem from '../components/ListItem';
import NavBar from '../components/NavBar';
import NavButton from '../components/NavButton';

const viewTint = '#5352ed';

const sourcesNames = {
  tw: 'Twitter',
  fb: 'Facebook',
  text: 'Text',
};

const noTestsMessage =
  "You don't have any test yet. They will appear here when you take one.";

const HistoryScreen = props => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      const storageHistory = await AsyncStorage.getItem('@LittleStore:history');
      const parsedHistory = JSON.parse(storageHistory).reverse();
      setHistory(parsedHistory);
    };
    getHistory();
  }, []);

  const renderSeparator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: '#ecf0f1',
      }}
    />
  );

  const _handlePress = item => {
    const {
      navigation: { navigate },
    } = props;
    const { title, subtitle, data } = item;
    navigate('Big5ClosedScreen', { ...data, title, subtitle });
  };

  const _keyExtractor = item => item.date;

  const renderItem = item => {
    const adaptedItem = {
      title: moment(item.date).format('MMMM Do YYYY, h:mm:ssA'),
      subtitle: sourcesNames[item.source],
      data: item,
    };
    return <ListItem onPress={_handlePress} item={adaptedItem} />;
  };

  const _onOpenActionSheet = async () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ['Clean history', 'Compare sources', 'Cancel'];
    const cancelButtonIndex = 2;
    const {
      showActionSheetWithOptions,
      navigation: { navigate },
    } = props;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: 'What do you want to do with your tests?',
      },
      async buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          _onPressClear();
        } else if (buttonIndex === 1) {
          navigate('CompareStatsScreen', { history });
        }
      },
    );
  };

  const _onPressClear = () => {
    Alert.alert(
      'Clear history',
      'Do you really want to clear your history?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const storageHistory = await AsyncStorage.setItem(
              '@LittleStore:history',
              JSON.stringify([]),
            );
            setHistory(storageHistory);
          },
        },
      ],
      { cancelable: false },
    );
  };

  const _renderListEmptyComponent = () => (
    <View style={styles.centeredContent}>
      <Text style={{ textAlign: 'center' }}>{noTestsMessage}</Text>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <Transition appear="top">
            <NavBar style={{ marginVertical: 20, marginHorizontal: 20 }}>
              <NavButton
                style={{ color: viewTint }}
                name="arrow-round-back"
                onPress={() => props.navigation.goBack()}
              />
              <Text style={styles.title}>Your History</Text>
              <NavButton
                name="more"
                style={{ color: viewTint }}
                onPress={_onOpenActionSheet}
              />
            </NavBar>
          </Transition>
          <Transition appear="bottom" disappear="bottom">
            <FlatList
              style={styles.list}
              data={history}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={_renderListEmptyComponent}
              ItemSeparatorComponent={renderSeparator}
              keyExtractor={_keyExtractor}
              renderItem={({ item }) => renderItem(item)}
            />
          </Transition>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: viewTint,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    textAlign: 'center',
    color: 'white',
    left: 0,
    right: 0,
    zIndex: -1,
  },
  list: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    flex: 1,
    paddingTop: 10,
    shadowOpacity: 0.55,
    shadowRadius: 5,
    shadowColor: '#2e3131',
    shadowOffset: { height: 0, width: 0 },
  },
});

export default connectActionSheet(HistoryScreen);
