import React from "react"
import {Platform} from "react-native"
import { createSwitchNavigator } from "react-navigation"
import MainTabNavigator from "./MainTabNavigator"
import {Tabs} from "./MainTabNavigator"
import GameScreen from "../screens/GameScreen"


export default createSwitchNavigator({
	// You could add another route here for authentication.
	// Read more at https://reactnavigation.org/docs/en/auth-flow.html
	Main: MainTabNavigator,

})
