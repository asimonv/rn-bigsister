import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import AppNavigator from "./navigation/AppNavigator";
import "./locales/i18n";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});

const App = props => (
  <ActionSheetProvider>
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar />}
      <AppNavigator {...props} />
    </View>
  </ActionSheetProvider>
);

export default App;
