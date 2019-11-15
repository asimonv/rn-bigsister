import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

import AsyncStorage from "@react-native-community/async-storage";

const LandingScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const _onPress = async () => {
    const { navigate } = navigation;
    await AsyncStorage.setItem("@LittleStore:entered", ":-)");
    navigate("Home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <Transition appear="top" disappear="top">
          <Text style={styles.description}>{t("landing-message")}</Text>
        </Transition>
        <Transition shared="logo" appear="bottom" disappear="bottom">
          <View style={{ width: 200, height: 200 }}>
            <LottieView
              style={{ flex: 1 }}
              source={require("../assets/animations/eye.json")}
              ref={animation => {
                this.animation = animation;
              }}
              autoPlay
              loop
              speed={0.3}
            />
          </View>
        </Transition>
        <Transition appear="left">
          <TouchableOpacity style={styles.button} onPress={_onPress}>
            <Text
              style={{
                ...styles.description,
                margin: 0,
                paddingHorizontal: 20,
                paddingVertical: 10
              }}
            >
              {t("try-me")}
            </Text>
          </TouchableOpacity>
        </Transition>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  description: {
    color: "white",
    margin: 20,
    fontSize: 18,
    fontWeight: "bold"
  },
  ai: {
    height: 400
  },
  button: {
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
    borderRadius: 5
  }
});

export default LandingScreen;
