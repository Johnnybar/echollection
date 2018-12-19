import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert
} from 'react-native';
import {Button, ButtonGroup} from 'react-native-elements';
import {ExpoLinksView} from '@expo/samples';

import {WebBrowser} from 'expo';

import {MonoText} from '../components/StyledText';

const sounds = {
  bell: require('../assets/sounds/bell.wav'),
  snare: require('../assets/sounds/snare.wav'),
  stab: require('../assets/sounds/stab.wav'),
  kick: require('../assets/sounds/kick.mp3'),
  hat: require('../assets/sounds/hat.mp3')
};
const soundsArr = [require('../assets/sounds/bell.wav'), require('../assets/sounds/snare.wav'), require('../assets/sounds/stab.wav'), require('../assets/sounds/kick.mp3'), require('../assets/sounds/hat.mp3')];

let playTimes = 1;
export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Game'
  };

  constructor(props) {
    super(props);
    this.state = {
      bell: 1,
      snare: 1,
      kick: 1,
      hat: 1,
      stab: 1
    }
  }

  _play = async (prop) => {
    if (prop) {
      try {
          let key = this.state.current;

          console.log(otherKeys);
          console.log(key, 'this is key');
          this.setState(prevState =>({
            [key]: 0.3
          }))

        const soundObject = new Expo.Audio.Sound()
        await soundObject.loadAsync(sounds[prop]);
        await soundObject.playAsync();
        // this.isPlaying = false;
      } catch (error) {
        console.log('>>>>>>>> ALARM PLAY', error);
      }
    }
  }

  _getRandomIntInclusive = (obj) => {
    var result;
    var count = 0;
    for (var prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
  return result;
  };

  _randomPlay = async (prop) => {
    try {

      let chosen = this._getRandomIntInclusive(sounds)
      console.log(chosen, 'this is chosen');
      this.setState({
        current: chosen,
      }, () => {
        this._play(chosen)
      });
      // this.isPlaying = false;
    } catch (error) {
      console.log('>>>>>>>> ALARM PLAY', error);
    }

  }

  render() {
    return (<View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}></View>
        <View style={styles.container}>
          <View style={styles.buttonsContainer}>
            <Button title="Random" onPress={() => this._randomPlay()} iconContainerStyle={{
                marginRight: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 130
              }}/>
            <Button title="BELL" style={[
                styles.roundButton, {
                  opacity: this.state.bell
                }
              ]} onPress={() => this._play('bell')} iconContainerStyle={{
                marginRight: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 130
              }}/>
            <Button title="SNARE" style={[
                styles.roundButton, {
                  opacity: this.state.snare
                }
              ]} onPress={() => this._play('snare')} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(199, 43, 98, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
            <Button title="KICK" style={[
                styles.roundButton, {
                  opacity: this.state.kick
                }
              ]} onPress={() => this._play('kick')} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(50, 173, 62, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
            <Button title="HAT" style={[
                styles.roundButton, {
                  opacity: this.state.hat
                }
              ]} onPress={() => this._play('hat')} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(255, 140, 0, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
            <Button title="STAB" style={[
                styles.roundButton, {
                  opacity: this.state.stab
                }
              ]} onPress={() => this._play('stab')} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(234, 144, 244, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
          </View>

        </View>

      </ScrollView>
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  contentContainer: {
    paddingTop: 30
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  roundButton: {
    margin: 10
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  }
});
