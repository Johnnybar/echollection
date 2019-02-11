import React from 'react';
import {StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';
import Colors from '../constants/Colors';
import { withNavigation } from 'react-navigation';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import InfoScreen from '../screens/InfoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameScreen from '../screens/GameScreen';

const MiniNavigator = createStackNavigator({
  Info: { screen: InfoScreen },
  Game: { screen: GameScreen },
  Settings: { screen: SettingsScreen },
});




class TabTestIcon extends React.Component {

  componentDidMount(){
  }
  render() {
    return (
      <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
    {/*Rest of App come ABOVE the action button component!*/}
    <ActionButton onPress={() => {console.log('hello')}} radius={100} degrees={180} buttonColor="rgba(231,76,60,1)">
      <ActionButton.Item style={styles.hidden}>
        <Icon style={styles.hidden} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {this.props.navigation.navigate('Game')}}>
        <Icon name="ios-bonfire" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {this.props.navigation.navigate('Settings')}}>
        <Icon name="ios-bonfire" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {this.props.navigation.navigate('Info')}}>
        <Icon name="ios-bonfire" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item style={styles.hidden}>
        <Icon style={styles.hidden} />
      </ActionButton.Item>
    </ActionButton>
  </View>
    )
  }
}

export default withNavigation(TabTestIcon)

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
    zIndex: 100
  },
  hidden:{
    display: 'none'
  }
});
