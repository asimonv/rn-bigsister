import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const DEBUG = false;

const clearAsyncStorage = async () => {
  if (DEBUG) {
    await AsyncStorage.clear();
  }
};

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  async bootstrapAsync() {
    await clearAsyncStorage();
    const user = await AsyncStorage.getItem('@LittleStore:entered');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    const { navigation } = this.props;
    navigation.navigate(user ? 'App' : 'Landing');
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
