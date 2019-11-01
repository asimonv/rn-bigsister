import React from 'react';
import {
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import NavBar from '../components/NavBar';
import NavButton from '../components/NavButton';
import ListItem from '../components/ListItem';

const viewTint = '#5352ed';

const renderSeparator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: '#ecf0f1',
    }}
  />
);

const _handleOnPress = item => {
  const { uri } = item;
  Linking.canOpenURL(uri)
    .then(supported => {
      if (!supported) {
        Alert.alert('Oops', `Can't handle url: ${uri}.`);
        return null;
      }
      return Linking.openURL(uri);
    })
    .catch(err => console.error('An error occurred', err));
};

const _keyExtractor = item => item.id;

const renderItem = (item, context) => {
  let listItem;
  switch (context) {
    case 'fb':
      listItem = {
        title: item.message,
        subtitle: item.created_time,
      };
      break;
    case 'tw':
      listItem = {
        title: item.text,
        subtitle: item.created_at,
      };
      break;
    default:
      break;
  }
  return <ListItem key={listItem.subtitle} onPress={() => {}} item={listItem} />;
};

const AnalyzedDataScreen = props => {
  const { navigation } = props;
  const content = navigation.getParam('content');
  const context = navigation.getParam('context');
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: viewTint }} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          bounces={false}
          style={{ flex: 1, backgroundColor: viewTint }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={styles.headerWrapper}>
            <NavBar style={{ marginVertical: 10, marginHorizontal: 20 }}>
              <NavButton
                style={{ color: viewTint }}
                name="arrow-round-back"
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.title}>Data</Text>
            </NavBar>
          </View>
          <View style={{ flex: 1 }}>
            <Transition appear="bottom" disappear="bottom">
              <FlatList
                style={styles.list}
                data={content}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={_keyExtractor}
                renderItem={({ item }) => renderItem(item, context)}
              />
            </Transition>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  scrollContainer: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
});

export default AnalyzedDataScreen;
