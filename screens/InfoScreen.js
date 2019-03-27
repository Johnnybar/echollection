import React from "react"
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Animated,
	Alert,
	SectionList,
	Linking
} from "react-native"
import {Button, ButtonGroup} from "react-native-elements"
import {withNavigation} from "react-navigation"


import { Constants } from "expo"

class InfoScreen extends React.Component {
  static navigationOptions = {
  	title: "ECHOLLECTION",
  };
  render() {
  	const { manifest } = Constants
  	const sections = [
  		// { data: [{ value: manifest.sdkVersion }], title: "sdkVersion" },
  		// { data: [{ value: manifest.privacy }], title: "privacy" },
  		{ data: [{ value: manifest.version }], title: "version" },
  		// { data: [{ value: manifest.orientation }], title: "orientation" },
  		{
  			data: [
  				{
  					value:
              manifest.ios && manifest.ios.supportsTablet ? "true" : "false",
  				},
  			],
  			title: "ios.supportsTablet",
  		},
  	]

  	return (
  		<ScrollView>
  			<SectionList
  				style={styles.container}
  				renderItem={this._renderItem}
  				renderSectionHeader={this._renderSectionHeader}
  				stickySectionHeadersEnabled={true}
  				keyExtractor={(item, index) => index}
  				ListHeaderComponent={ListHeader}
  				sections={sections}
  			/>

  		</ScrollView>


  	)
  }

  _renderSectionHeader = ({ section }) => {
  	return <SectionHeader title={section.title} />
  };

  _renderItem = ({ item }) => {
  	if (item.type === "color") {
  		return (
  			<SectionContent>
  				{item.value && <Color value={item.value} />}
  			</SectionContent>
  		)
  	} else {
  		return (
  			<SectionContent>
  				<Text style={styles.sectionContentText}>
  					{item.value}
  				</Text>
  			</SectionContent>
  		)
  	}
  };
}

const ListHeader = () => {
	const { manifest } = Constants

	return (
		<View style={styles.titleContainer}>
			<Image source={require("../assets/images/ball.jpg")} style={styles.backgroundImage} />
			<View style={styles.buttonImagesContainer}>
				<TouchableOpacity><Image onPress={() => {
  				this.props.navigation.navigate("Game")
  			}} source={require("../assets/images/home-play.png")} style={[styles.buttonImages, styles.playButton]}/></TouchableOpacity>
				<TouchableOpacity><Image source={require("../assets/images/home-settings.png")} style={[styles.buttonImages, styles.settingsButton]}/></TouchableOpacity>
				<TouchableOpacity><Image source={require("../assets/images/home-sound.png")}  style={[styles.buttonImages, styles.homeButton]}/></TouchableOpacity>
			</View>
			{/* <View style={styles.titleIconContainer}>
				<AppIconPreview iconUrl={manifest.iconUrl} />
			</View>

			<View style={styles.titleTextContainer}>
				<Text style={styles.nameText} numberOfLines={1}>
					{manifest.name}
				</Text>

				<Text style={styles.slugText} numberOfLines={1}>
					{manifest.slug}
				</Text>

				<Text style={styles.descriptionText}>
					{manifest.description}
				</Text>
				<Text onPress={()=> Linking.openURL("https://www.flaticon.com/authors/smashicons")}>Icons made </Text><Text onPress={()=> Linking.openURL("https://www.freepik.com")}>by Freepik</Text><Text onPress={()=> Linking.openURL("https://www.flaticon.com")}> from www.flaticon.com </Text><Text onPress={()=> Linking.openURL("http://creativecommons.org/licenses/by/3.0/")}> is licensed by CC 3.0</Text>
				<Text onPress={()=> Linking.openURL("https://www.flaticon.com/authors/kiranshastry")}>Cowbell icon made </Text><Text onPress={()=> Linking.openURL("https://www.flaticon.com/authors/kiranshastry")}>by kiranshastry</Text><Text onPress={()=> Linking.openURL("https://www.flaticon.com")}> from www.flaticon.com </Text><Text onPress={()=> Linking.openURL("http://creativecommons.org/licenses/by/3.0/")}> is licensed by CC 3.0</Text>

			</View> */}
		</View>
	)
}

const SectionHeader = ({ title }) => {
	return (
		<View style={styles.sectionHeaderContainer}>
			<Text style={styles.sectionHeaderText}>
				{title}
			</Text>
		</View>
	)
}

const SectionContent = props => {
	return (
		<View style={styles.sectionContentContainer}>
			{props.children}
		</View>
	)
}

const AppIconPreview = ({ iconUrl }) => {
	if (!iconUrl) {
		iconUrl =
      "https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png"
	}

	return (
		<Image
			source={{ uri: iconUrl }}
			style={{ width: 64, height: 64 }}
			resizeMode="cover"
		/>

	)
}

const Color = ({ value }) => {
	if (!value) {
		return <View />
	} else {
		return (
			<View style={styles.colorContainer}>
				<View style={[styles.colorPreview, { backgroundColor: value }]} />
				<View style={styles.colorTextContainer}>
					<Text style={styles.sectionContentText}>
						{value}
					</Text>


        )
				</View>
			</View>
		)
	}
}


export default withNavigation(InfoScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	backgroundImage: {
		width: "200%",
		height: 300,
		left: "-50%",
		right: "50%",
		resizeMode: "cover",
	},
	buttonImagesContainer:{
		position: "absolute",
		width: "100%",
		left: "50%",
		top: "20%",

	},
	buttonImages: {
		width: 70,
		height: 70,
		resizeMode: "stretch",
	},
	playButton: {
		marginLeft: "-30%"
	},
	settingsButton: {
		marginLeft: "-5%"
	},
	homeButton: {
		marginLeft: "20%"
	},
	titleContainer: {
		paddingHorizontal: 15,
		paddingTop: 15-15,
		paddingBottom: 15,
		flexDirection: "column",
		position:"relative"
	},
	titleIconContainer: {
		marginRight: 15,
		paddingTop: 2,
	},
	sectionHeaderContainer: {
		backgroundColor: "#fbfbfb",
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#ededed",
	},
	sectionHeaderText: {
		fontSize: 14,
	},
	sectionContentContainer: {
		paddingTop: 8,
		paddingBottom: 12,
		paddingHorizontal: 15,
	},
	sectionContentText: {
		color: "#808080",
		fontSize: 14,
	},
	nameText: {
		fontWeight: "600",
		fontSize: 18,
	},
	slugText: {
		color: "#a39f9f",
		fontSize: 14,
		backgroundColor: "transparent",
	},
	descriptionText: {
		fontSize: 14,
		marginTop: 6,
		color: "#4d4d4d",
	},
	colorContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	colorPreview: {
		width: 17,
		height: 17,
		borderRadius: 2,
		marginRight: 6,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#ccc",
	},
	colorTextContainer: {
		flex: 1,
	},
})
