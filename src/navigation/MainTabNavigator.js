import { FluidNavigator } from "react-navigation-fluid-transitions";

import HomeScreen from "../screens/HomeScreen";
import Screen1 from "../screens/Screen1";
import InfoScreen from "../screens/InfoScreen";
import TextScreen from "../screens/TextScreen";
import Big5ClosedScreen from "../screens/Big5ClosedScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AnalyzedDataScreen from "../screens/AnalyzedDataScreen";
import CompareStatsScreen from "../screens/CompareStatsScreen";

const HomeStack = FluidNavigator({
  Home: { screen: HomeScreen, path: "home/:user" },
  screen1: { screen: Screen1, path: "results/:spotify_auth_code" },
  InfoScreen: { screen: InfoScreen },
  TextScreen: { screen: TextScreen },
  Big5ClosedScreen: { screen: Big5ClosedScreen },
  HistoryScreen: { screen: HistoryScreen },
  AnalyzedDataScreen: { screen: AnalyzedDataScreen },
  CompareStatsScreen: { screen: CompareStatsScreen },
});

export default HomeStack;
