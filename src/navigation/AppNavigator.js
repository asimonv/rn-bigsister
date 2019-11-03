import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { FluidNavigator } from "react-navigation-fluid-transitions";

import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import MainTabNavigator from "./MainTabNavigator";
import LandingScreen from "../screens/LandingScreen";

const LandingStack = FluidNavigator({ LandingScreen });

const prefix = "littlesister://";

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Landing: LandingStack,
    },
    {
      initialRouteName: "AuthLoading",
    },
  ),
);

const MainApp = () => <AppContainer uriPrefix={prefix} />;

export default MainApp;
