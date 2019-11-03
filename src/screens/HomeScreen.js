import React, { Component } from "react";
import {
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import AsyncStorage from "@react-native-community/async-storage";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";

import {
  isUserLoggedIn,
  handleFacebookLogin,
  logoutUser,
} from "../services/facebook";
import MessageBubble from "../components/MessageBubble";
import NavButton from "../components/NavButton";
import NavBar from "../components/NavBar";

const colors = ["#240080", "#DA21B7"];
const viewTint = "rebeccapurple";
const serverURL = "https://little-sister.herokuapp.com";

class HomeScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    title: "Discover",
  };

  constructor(props) {
    super(props);
    this.eyeOnPress = this.eyeOnPress.bind(this);
    this._onOpenActionSheet = this._onOpenActionSheet.bind(this);
  }

  async componentDidMount() {
    StatusBar.setBarStyle("light-content", true);

    // Add event listener to handle OAuthLogin:// URLs
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.handleOpenURL({ url });
      });
    } else {
      Linking.addEventListener("url", this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = async ({ url }) => {
    // Extract stringified user string out of the URL
    console.log("came back: ", url);
    if (url) {
      const checkTwitter = url.match(/user=([^#]+)/);
      if (checkTwitter) {
        const [, user] = checkTwitter;
        await AsyncStorage.setItem("@LittleStore:twitterId", user);
        const {
          navigation: { navigate },
        } = this.props;
        navigate("TextScreen", { context: "tw" });
      }
      const checkSpotify = url.match(/spotify_auth_code=([^#]+)/);
      if (checkSpotify) {
        const [, spotify_auth_code] = checkSpotify;
        await AsyncStorage.setItem(
          "@LittleStore:spotify_auth_code",
          spotify_auth_code,
        );
      }
    }
  };

  // Open URL in a browser
  openURL = url => {
    Linking.openURL(url);
  };

  _onOpenActionSheet = async () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      "My opinion on a subject",
      "My Facebook",
      "My Twitter",
      "Cancel",
    ];
    const cancelButtonIndex = 3;
    const {
      showActionSheetWithOptions,
      navigation: { navigate },
    } = this.props;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title:
          "Please give me a source of information to analyze and describe your identity",
      },
      async buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          navigate("TextScreen");
        } else if (buttonIndex === 1) {
          if (await isUserLoggedIn()) {
            console.log("fb logged in");
            navigate("TextScreen", { context: "fb" });
          } else {
            try {
              await handleFacebookLogin();
              navigate("TextScreen", { context: "fb" });
            } catch (e) {
              console.log(e);
            }
          }
        } else if (buttonIndex === 2) {
          if (!(await AsyncStorage.getItem("@LittleStore:twitterId"))) {
            this.openURL(`${serverURL}/auth/twitter`);
          } else {
            navigate("TextScreen", { context: "tw" });
          }
        }
      },
    );
  };

  _showHistory = () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate("HistoryScreen");
  };

  _handleLogout = async () => {
    const facebookLoggedIn = await isUserLoggedIn();
    const twitterLoggedIn = await AsyncStorage.getItem(
      "@LittleStore:twitterId",
    );
    //  const spotifyLoggedIn = await Spotify.isLoggedInAsync();
    const options = [];

    if (facebookLoggedIn) {
      options.push("Facebook");
    }

    if (twitterLoggedIn) {
      options.push("Twitter");
    }

    /* if (spotifyLoggedIn) {
      options.push('Spotify');
    } */

    options.push("Cancel");

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const cancelButtonIndex = options.length - 1;
    const {
      showActionSheetWithOptions,
      navigation: { navigate },
    } = this.props;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title:
          "These are the accounts that you have given your permission for them to acceess your personal data",
        message: "Please choose one to log it out",
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
            //  await Spotify.logout();
            break;
          default:
            break;
        }
      },
    );
  };

  eyeOnPress() {
    // this.animation.play();
    this._onOpenActionSheet();
  }

  render() {
    const { navigation } = this.props;
    return (
      <LinearGradient
        style={styles.container}
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <NavBar style={{ position: "absolute", top: 50, left: 20, right: 20 }}>
          <NavButton
            name="clock"
            style={{ color: viewTint }}
            onPress={this._showHistory}
          />
          <NavButton
            name="remove-circle-outline"
            style={{ color: viewTint }}
            onPress={this._handleLogout}
          />
        </NavBar>
        <Transition appear="top">
          <MessageBubble style={{ margin: 10 }}>
            <Text style={styles.tapEyeText}>
              {"Tap my eye to recieve knowledge about yourself"}
            </Text>
          </MessageBubble>
        </Transition>
        <Transition shared="logo" appear="bottom">
          <TouchableOpacity
            onPress={this.eyeOnPress}
            style={{ width: 200, height: 200 }}
          >
            <LottieView
              style={{ flex: 1 }}
              source={require("../assets/animations/eye.json")}
              ref={animation => {
                this.animation = animation;
              }}
              loop={false}
            />
          </TouchableOpacity>
        </Transition>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  tapEyeText: {
    fontSize: 18,
    fontWeight: "600",
    color: viewTint,
    textAlign: "center",
    padding: 5,
  },
});

export default connectActionSheet(HomeScreen);
