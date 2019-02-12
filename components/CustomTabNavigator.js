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
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';
import Colors from '../constants/Colors';
import { withNavigation } from 'react-navigation';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import InfoScreen from '../screens/InfoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameScreen from '../screens/GameScreen';
import TabBarIcon from './TabBarIcon';




class CustomTabNavigator extends React.Component {

  componentDidMount(){
  }
  render() {
    return (
      <View style={styles.ActionButtonContainer}>
        <TouchableOpacity style={styles.sideTabLeft}>
                  <TabBarIcon name={Platform.OS === 'ios' ? 'ios-volume-mute' : 'md-volume-mute'} />
                </TouchableOpacity>
    {/*Rest of App come ABOVE the action button component!*/}
    <ActionButton onPress={() => {console.log('hello')}} radius={100} degrees={180} buttonColor="rgba(231,76,60,1)">
      <ActionButton.Item style={styles.hidden}>
        <Icon style={styles.hidden} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Game" onPress={() => {this.props.navigation.navigate('Game')}}>
        <Icon name={Platform.OS === 'ios' ? 'ios-musical-notes' : 'md-musical-notes'} style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Settings" onPress={() => {this.props.navigation.navigate('Settings')}}>
        <Icon name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Info" onPress={() => {this.props.navigation.navigate('Info')}}>
        <Icon name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'} style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item style={styles.hidden}>
        <Icon style={styles.hidden} />
      </ActionButton.Item>

    </ActionButton>
    <TouchableOpacity style={styles.sideTabRight}>
              <TabBarIcon name={Platform.OS === 'ios' ? 'ios-information-circle-outline' : 'md-information-circle-outline'} />
            </TouchableOpacity>
  </View>
    )
  }
}

export default withNavigation(CustomTabNavigator)

const styles = StyleSheet.create({
  ActionButtonContainer:{
    flex:0.1,
    backgroundColor: '#f3f3f3',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'


  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  sideTabLeft:{
    width: 20,
  },
  sideTabRight:{

    width: 20,
  },
  hidden:{
    display: 'none'
  }
});
