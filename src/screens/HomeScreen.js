import React, { useEffect } from "react";
import {
  Alert,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import AsyncStorage from "@react-native-community/async-storage";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

import {
  isUserLoggedIn,
  handleFacebookLogin,
  logoutUser
} from "../services/facebook";
import { isSpotifyTokenExpired, clearSpotifyToken } from "../services/spotify";
import MessageBubble from "../components/MessageBubble";
import NavButton from "../components/NavButton";
import NavBar from "../components/NavBar";

const colors = ["#240080", "#DA21B7"];
const viewTint = "rebeccapurple";
const serverURL = "https://little-sister.herokuapp.com";

const HomeScreen = props => {
  const { t, i18n } = useTranslation();
  const {
    showActionSheetWithOptions,
    navigation: { navigate }
  } = props;

  useEffect(() => {
    StatusBar.setBarStyle("light-content", true);

    // Add event listener to handle OAuthLogin:// URLs
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        handleOpenURL({ url });
      });
    } else {
      Linking.addEventListener("url", handleOpenURL);
    }

    return () => {
      console.log("componentWillUnmount");
      Linking.removeEventListener("url", handleOpenURL);
    };
  });

  const handleOpenURL = async ({ url }) => {
    // Extract stringified user string out of the URL
    console.log("came back: ", url);
    if (url) {
      const checkTwitter = url.match(/user=([^#]+)/);
      if (checkTwitter) {
        const [, user] = checkTwitter;
        await AsyncStorage.setItem("@LittleStore:twitterId", user);
        Alert.alert(t("accounts.approved"), "", [
          { text: t("cancel"), style: "cancel" },
          {
            text: `${t("start-test")}`,
            onPress: () => navigate("TextScreen", { context: "tw" })
          }
        ]);
      }
      const checkSpotify = url.match(/spotify_auth_code=([^#]+)/);
      if (checkSpotify) {
        const [, spotify_auth_code] = checkSpotify;
        await AsyncStorage.setItem(
          "@LittleStore:spotify_auth_code",
          spotify_auth_code
        );
      }
    }
  };

  // Open URL in a browser
  const openURL = url => {
    Linking.openURL(url);
  };

  const _onOpenActionSheet = async () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      `${t("my")} Facebook`,
      `${t("my")} Twitter`,
      `${t("my")} ${t("subject-opinion")}`,
      `${t("cancel")}`
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: t("choose-source-message")
      },
      async buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          if (await isUserLoggedIn()) {
            navigate("TextScreen", { context: "fb" });
          } else {
            try {
              await handleFacebookLogin();
              Alert.alert(t("accounts.approved"), "", [
                { text: t("cancel"), style: "cancel" },
                {
                  text: `${t("start-test")}`,
                  onPress: () => navigate("TextScreen", { context: "fb" })
                }
              ]);
            } catch (e) {
              console.log(e);
            }
          }
        } else if (buttonIndex === 1) {
          if (!(await AsyncStorage.getItem("@LittleStore:twitterId"))) {
            openURL(`${serverURL}/auth/twitter`);
          } else {
            navigate("TextScreen", { context: "tw" });
          }
        } else if (buttonIndex === 2) {
          navigate("TextScreen");
        }
      }
    );
  };

  const _showHistory = () => {
    navigate("HistoryScreen");
  };

  const eyeOnPress = () => {
    // this.animation.play();
    _onOpenActionSheet();
  };

  const _toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "es" : "en");
  };

  const _handleLogout = async () => {
    const facebookLoggedIn = await isUserLoggedIn();
    const twitterLoggedIn = await AsyncStorage.getItem(
      "@LittleStore:twitterId"
    );
    //  const spotifyLoggedIn = await Spotify.isLoggedInAsync();
    const options = [];

    if (facebookLoggedIn) {
      options.push("Facebook");
    }

    if (twitterLoggedIn) {
      options.push("Twitter");
    }

    if (!(await isSpotifyTokenExpired())) {
      options.push("Spotify");
    } else {
      console.log("not expired yet");
    }

    options.push("Cancel");

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: t("accounts-info"),
        message: t("accounts-logout-message")
      },
      async buttonIndex => {
        // Do something here depending on the button index selected
        const selectedOption = options[buttonIndex];
        switch (selectedOption) {
          case "Facebook":
            await logoutUser();
            break;
          case "Twitter":
            await AsyncStorage.removeItem("@LittleStore:twitterId");
            break;
          case "Spotify":
            await clearSpotifyToken();
            break;
          default:
            break;
        }
      }
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Transition appear="top">
        <NavBar style={{ position: "absolute", top: 50, left: 20, right: 20 }}>
          <NavButton
            name="clock"
            style={{ color: viewTint }}
            onPress={_showHistory}
          />
          <NavButton
            name="globe"
            style={{ color: viewTint }}
            onPress={_toggleLanguage}
          />
          <NavButton
            name="remove-circle-outline"
            style={{ color: viewTint }}
            onPress={_handleLogout}
          />
        </NavBar>
      </Transition>
      <Transition appear="top">
        <MessageBubble style={{ margin: 10 }}>
          <Text style={styles.tapEyeText}>{t("welcome-message")}</Text>
        </MessageBubble>
      </Transition>
      <Transition shared="logo" appear="bottom">
        <TouchableOpacity
          onPress={eyeOnPress}
          style={{ width: 200, height: 200 }}
        >
          <LottieView
            style={{ flex: 1 }}
            source={require("../assets/animations/eye.json")}
            loop={false}
          />
        </TouchableOpacity>
      </Transition>
    </LinearGradient>
  );
};

HomeScreen.navigationOptions = {
  headerTransparent: true,
  title: "Discover"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1
  },
  tapEyeText: {
    fontSize: 18,
    fontWeight: "600",
    color: viewTint,
    textAlign: "center",
    padding: 5
  }
});

export default connectActionSheet(HomeScreen);
