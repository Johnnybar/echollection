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
	SectionList
} from "react-native"
import {Button, ButtonGroup} from "react-native-elements"
import {connect} from "react-redux"
import {gameChangeLevel} from "../actions/actions"
import {gameSetSound} from "../actions/actions"

class SettingsScreen extends React.Component {
	static navigationOptions = {
		title: "Settings"
	};
	constructor(props) {
		super(props)
		this.state = {
			muted: false
		}
	}

	componentDidMount() {}
	render() {

		return (<ScrollView>
			<Button style={styles.sectionContentContainer} title={this.props.muted === false
				? "mute sound"
				: "turn sound on"} onPress={() => {

				this.setState(prevState => ({
					muted: !prevState.muted
				}), () => {
					this.props.setSound(this.state.muted)
					// Expo.Audio.setIsEnabledAsync(this.state.muted)
					// console.log(this.state, 'now here');
				})
			}}></Button>
			<Button style={styles.sectionContentContainer} title="Choose Easy Level" onPress={() => {
				this.props.setLevel(4, 800)
				playTimes = 0
				playArr = []
			}}></Button>

			<Button style={styles.sectionContentContainer} title="Medium Level" onPress={() => {
				this.props.setLevel(6, 600)
				playTimes = 0
				playArr = []
			}}></Button>
			<Button style={styles.sectionContentContainer} title="Hard Level" onPress={() => {
				this.props.setLevel(8, 400)
				playTimes = 0
				playArr = []
			}}></Button>
		</ScrollView>)
	}
}

const styles = StyleSheet.create({

	sectionContentContainer: {
		paddingTop: 8,
		paddingBottom: 12,
		paddingHorizontal: 15
	}
})

const mapStateToProps = (state) => {
	return {level: state.level, speed: state.speed, muted: state.muted}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLevel: (level, speed) => dispatch(gameChangeLevel(level, speed)),
		setSound: (muted) => dispatch(gameSetSound(muted))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
