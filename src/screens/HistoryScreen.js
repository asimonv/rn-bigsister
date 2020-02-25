import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import AsyncStorage from "@react-native-community/async-storage";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { SafeAreaView } from "react-navigation";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ListItem from "../components/ListItem";
import NavBar from "../components/NavBar";
import NavButton from "../components/NavButton";
import MessageBubble from "../components/MessageBubble";
import TooltipHelper from "../components/TooltipHelper";

const viewTint = "#5352ed";

const sourcesNames = {
  tw: "Twitter",
  fb: "Facebook",
  text: "Text"
};

const HistoryScreen = props => {
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false]);
  const {
    showActionSheetWithOptions,
    navigation: { navigate }
  } = props;
  const { t } = useTranslation();
  const noTestsMessage = t("no-tests-message");

  useEffect(() => {
    const checkTour = async () => {
      const completedTour = await AsyncStorage.getItem(
        "@LittleStore.tour.History"
      );
      setVisible([!JSON.parse(completedTour), false, false]);
    };

    const getHistory = async () => {
      const storageHistory = await AsyncStorage.getItem("@LittleStore:history");
      const parsedHistory = JSON.parse(storageHistory).reverse();
      console.log(parsedHistory);

      setHistory(parsedHistory);
    };
    getHistory();
    checkTour();
  }, []);

  const renderSeparator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: "#ecf0f1"
      }}
    />
  );

  const _handlePress = item => {
    const { title, subtitle, data } = item;
    navigate("Big5ClosedScreen", { ...data, title, subtitle });
  };

  const _keyExtractor = item => item.date;

  const renderItem = item => {
    const adaptedItem = {
      title: moment(item.date).format("MMMM Do YYYY, h:mm:ssA"),
      subtitle: `${sourcesNames[item.source]} ${
        item.modified ? "(Modified)" : ""
      } ${item.description ? ` - ${item.description}` : ""}`,
      data: item
    };
    return <ListItem onPress={_handlePress} item={adaptedItem} />;
  };

  const _onOpenActionSheet = async () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [t("clear-history"), t("compare-sources"), t("cancel")];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: t("tests-option-title")
      },
      async buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          _onPressClear();
        } else if (buttonIndex === 1) {
          navigate("CompareStatsScreen", { history });
        }
      }
    );
  };

  const _onPressClear = () => {
    Alert.alert(
      t("clear-history"),
      t("confirmation-clear-history"),
      [
        {
          text: t("cancel"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            const storageHistory = await AsyncStorage.setItem(
              "@LittleStore:history",
              JSON.stringify([])
            );
            setHistory(storageHistory);
          }
        }
      ],
      { cancelable: false }
    );
  };

  const _renderListEmptyComponent = () => (
    <View style={styles.centeredContent}>
      <MessageBubble
        style={{ backgroundColor: "rgba(255, 242, 0,1.0)", borderWidth: 2 }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "black",
            textAlign: "center",
            padding: 5
          }}
        >
          {noTestsMessage}
        </Text>
      </MessageBubble>
    </View>
  );

  const _handleTooltipOnPress = async index => {
    setVisible(
      visible.map((x, i) => {
        if (i === index || i === index + 1) {
          return !x;
        }
        return x;
      })
    );

    if (index === visible.length - 1) {
      await AsyncStorage.setItem(
        "@LittleStore.tour.History",
        JSON.stringify(true)
      );
    }
  };
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
              <Text style={styles.title}>{t("history-title")}</Text>
              <TooltipHelper
                isVisible={visible[0]}
                index={0}
                setVisible={_handleTooltipOnPress}
                text={t("helpers.history.buttons.options")}
                contentStyle={{
                  right: -36
                }}
              >
                <NavButton
                  name="more"
                  style={{ color: viewTint }}
                  onPress={_onOpenActionSheet}
                />
              </TooltipHelper>
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
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: viewTint
  },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute",
    textAlign: "center",
    color: "white",
    left: 0,
    right: 0,
    zIndex: -1
  },
  list: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    flex: 1,
    paddingTop: 10,
    shadowOpacity: 0.55,
    shadowRadius: 5,
    shadowColor: "#2e3131",
    shadowOffset: { height: 0, width: 0 }
  }
});

export default connectActionSheet(HistoryScreen);
