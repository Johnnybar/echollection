import React from "react"
import { Platform } from "react-native"
import { createStackNavigator, createBottomTabNavigator } from "react-navigation"

import CustomTabNavigator from "../components/CustomTabNavigator"
import TabBarIcon from "../components/TabBarIcon"
import InfoScreen from "../screens/InfoScreen"
import GameScreen from "../screens/GameScreen"
import SettingsScreen from "../screens/SettingsScreen"
import {withNavigation} from "react-navigation"

const InfoStack = createStackNavigator({
	Info: InfoScreen,
})

InfoStack.navigationOptions = {
	tabBarLabel: "Info",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === "ios"
					? `ios-information-circle${focused ? "" : "-outline"}`
					: "md-information-circle"
			}
		/>
	),
}

const GameStack = createStackNavigator({
	Game: GameScreen,
})

GameStack.navigationOptions = {
	tabBarLabel: "Game",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === "ios" ? "ios-musical-notes" : "md-musical-notes"}
		/>
	),
}

const SettingsStack = createStackNavigator({
	Settings: SettingsScreen,
})


SettingsStack.navigationOptions = {
	tabBarLabel: "Settings",

	tabBarIcon:"Settings",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
		/>
	),
}


export default createBottomTabNavigator({
	InfoStack,
	GameStack,
	SettingsStack,
}, {
	tabBarComponent: CustomTabNavigator

})
