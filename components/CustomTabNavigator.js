import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert,
  SectionList,
  Platform
} from 'react-native';
import {gameSetSound} from '../actions/actions';
import {gameRestart} from '../actions/actions';
import {connect} from "react-redux";

import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';
import Colors from '../constants/Colors';
import {withNavigation} from 'react-navigation';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import InfoScreen from '../screens/InfoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameScreen from '../screens/GameScreen';
import TabBarIcon from './TabBarIcon';

class CustomTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      muted: false,

    };
  }
  restartFunction = () => {
    console.log('in restart');
    this.setState({restart: true})
  }
  componentDidMount() {}
  render() {
    return (<View style={styles.ActionButtonContainer}>
      <TouchableOpacity style={styles.sideTabLeft} onPress={() => {
          this.props.navigation.navigate('Game')
        }}>
        <TabBarIcon name={Platform.OS === 'ios'
            ? 'ios-musical-notes'
            : 'md-musical-notes'}/>
      </TouchableOpacity>
      {/* Rest of App come ABOVE the action button component! */}
      <ActionButton onPress={() => {
        }} radius={100} degrees={180} buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item style={styles.hidden}>
          <Icon style={styles.hidden}/>
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Game" onPress={() => {

            this.setState(prevState => ({
              muted: !prevState.muted
            }), () => {
              this.props.setSound(this.state.muted)
              // Expo.Audio.setIsEnabledAsync(this.state.muted)
              // console.log(this.state, 'now here');
            })
          }}>
          <Icon name={this.state.muted === false
              ? "ios-volume-off"
              : "ios-volume-high"} style={styles.actionButtonIcon}/>
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Restart" onPress={() => {
            this.setState({
              restart: true
            }, () => 
            this.props.gameRestart(this.state.restart))

              // Expo.Audio.setIsEnabledAsync(this.state.muted)
              // console.log(this.state, 'now here');

          }}>
          <Icon name={Platform.OS === 'ios'
              ? 'ios-refresh'
              : 'md-refresh'} style={styles.actionButtonIcon}/>
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Info" onPress={() => {
            this.props.navigation.navigate('Info')
          }}>
          <Icon name={Platform.OS === 'ios'
              ? 'ios-information-circle'
              : 'md-information-circle'} style={styles.actionButtonIcon}/>
        </ActionButton.Item>
        <ActionButton.Item style={styles.hidden}>
          <Icon style={styles.hidden}/>
        </ActionButton.Item>

      </ActionButton>
      <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Settings')
        }} style={styles.sideTabRight}>
        <TabBarIcon name={Platform.OS === 'ios'
            ? 'ios-settings'
            : 'md-settings'}/>
      </TouchableOpacity>
    </View>)
  }
}

const mapStateToProps = (state) => {
  return {muted: state.muted, restart: state.restart}
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSound: (muted) => dispatch(gameSetSound(muted)),
    gameRestart: (restart) => dispatch(gameRestart(restart))
  };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CustomTabNavigator))

const styles = StyleSheet.create({
  ActionButtonContainer: {

    backgroundColor: '#f3f3f3',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%'

  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  },
  sideTabLeft: {
    width: 20
  },
  sideTabRight: {

    width: 20
  },
  hidden: {
    display: 'none'
  }
});
